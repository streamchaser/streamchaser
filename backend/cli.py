import httpx
import typer
from app.api import fetch_changed_media_ids
from app.api import fetch_jsongz_files
from app.api import fetch_media_ids
from app.api import get_genres
from app.config import Environment
from app.config import get_settings
from app.db.cache import redis
from app.db.database_service import countries_to_redis
from app.db.database_service import insert_genres_to_cache
from app.db.database_service import providers_to_redis
from app.db.database_service import remove_stale_media
from app.db.search import client
from app.db.search import search_client_config
from app.util import chunkify
from app.util import coroutine
from meilisearch.errors import MeiliSearchApiError
from tqdm import tqdm

supported_country_codes = get_settings().supported_country_codes

app = typer.Typer()


@app.command()
def fetch_jsongz():
    fetch_jsongz_files()


@app.command()
def update_ids(ids: list[str]):
    if wrong_ids := [
        id for id in ids if id[0] not in ["m", "t"] or not id[1:].isnumeric()
    ]:
        echo_warning(
            f"One or more of the ids are not formatted correctly: {wrong_ids}\n"
            "The ids will not be sent"
        )
        return
    with httpx.Client(http2=True) as client:
        res = client.post("http://internal:8888/update-media", json={"ids": ids})
        echo_success(res.json()["info"])


@app.command()
def update_media(
    chunk_size: int = 25000, first_time: bool = False, popularity: float = 1
):
    """Sends media ids to our internal update-media endpoint in chunks"""
    movie_ids, tv_ids = (
        fetch_media_ids(popularity) if first_time else fetch_changed_media_ids()
    )

    print(
        f"\nAbout to update {len(movie_ids)} movies and {len(tv_ids)} TV shows"
        f" in chunks of {chunk_size}"
    )

    with httpx.Client(http2=True, timeout=60) as client:
        for media in zip(["movies", "tv shows"], [movie_ids, tv_ids]):
            id_chunks, total_chunks = chunkify(media[1], chunk_size)
            for id_chunk in tqdm(
                id_chunks,
                total=total_chunks,
                desc=f"Updating {media[0]}",
            ):
                client.post("http://internal:8888/update-media", json={"ids": id_chunk})


@app.command()
@coroutine
async def clear_stale_media_from_search(days_for_expiry: int = 3):
    await remove_stale_media(days_for_expiry)


@app.command()
def remove_blacklisted_from_search():
    """Deletes all the ids from blacklist.txt from MeiliSearch"""
    blacklisted_media = [line.rstrip() for line in open("blacklist.txt")]
    client.index("media").delete_documents(blacklisted_media)

    typer.echo(f"Attempted to remove {len(blacklisted_media)} blacklisted media")


@app.command()
@coroutine
async def refresh_redis():
    """Flushes everything then adds genres and providers to Redis"""
    await redis.flushdb()
    await insert_genres_to_cache(get_genres())
    await providers_to_redis()
    await countries_to_redis()


@app.command()
@coroutine
async def flush_cache():
    """Flushes everything from Redis"""
    await redis.flushdb()


@app.command()
def update_search_config():
    search_client_config()


@app.command()
@coroutine
async def full_setup(
    popularity: float = 1, first_time: bool = False, chunk_size: int = 25000
):
    await insert_genres_to_cache(get_genres())
    await providers_to_redis()
    await countries_to_redis()
    if get_settings().app_environment == Environment.DEVELOPMENT:
        # Is ran at startup in production
        search_client_config()
    update_media(chunk_size=chunk_size, first_time=first_time, popularity=popularity)
    # Removes before indexing MeiliSearch
    remove_blacklisted_from_search()
    await remove_stale_media()  # TODO: remove when it is it's own cronjob


@app.command()
def remove_media(media_id: str, blacklist: bool = True):
    """Deletes a media from MeiliSearch and adds it to the blacklist"""
    try:
        media = client.index("media").get_document(media_id)
        typer.confirm(
            f"Are you sure you want to remove & blacklist [{media.title}]?", abort=True
        )
    except MeiliSearchApiError as e:
        typer.echo(e)
        typer.confirm("Are you sure you want to continue?", abort=True)

    typer.echo(f"Removing and blacklisting: {media_id}")
    client.index("media").delete_document(media_id)
    typer.echo("Removed from Meilisearch ✓")

    if blacklist:
        with open("blacklist.txt", "a+") as file:
            file.seek(0)
            if media_id in file.read().splitlines():
                typer.echo(f"{media_id} already in blacklist")
            else:
                file.write(f"{media_id}\n")
                typer.echo("Added to blacklist ✓")

    typer.echo("Meilisearch updated ✓")


def echo_success(msg: str):
    typer.echo(
        typer.style(
            msg,
            fg=typer.colors.GREEN,
            bold=True,
        )
    )


def echo_warning(msg: str):
    typer.echo(
        typer.style(
            msg,
            fg=typer.colors.RED,
            bold=True,
        )
    )


if __name__ == "__main__":
    app()
