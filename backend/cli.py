import httpx
import typer
from app.api import fetch_changed_media_ids
from app.api import fetch_jsongz_files
from app.api import fetch_media_ids
from app.api import get_genres
from app.config import Environment
from app.config import get_settings
from app.db import database
from app.db.cache import redis
from app.db.crud import delete_all_media
from app.db.crud import delete_media_by_id
from app.db.crud import get_media_by_id
from app.db.database_service import extract_unique_providers_to_cache
from app.db.database_service import index_media
from app.db.database_service import insert_genres_to_cache
from app.db.database_service import prune_non_ascii_media_from_db
from app.db.search import client
from app.db.search import update_index
from app.util import chunkify
from app.util import coroutine
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
    with httpx.Client() as client:
        res = client.post("http://internal:8888/update-media", json={"ids": ids})
        echo_success(res.json()["info"])


@app.command()
def index_meilisearch():
    if get_settings().app_environment == Environment.DEVELOPMENT:
        # Is ran at startup in production
        update_index()

    country_codes = get_settings().supported_country_codes

    for country_code in tqdm(
        country_codes, desc=f"Indexing {len(country_codes)} countries"
    ):
        index_media(country_code)


@app.command()
def update_media(
    chunk_size: int = 1000, first_time: bool = False, popularity: float = 1
):
    """Sends media ids to our internal update-media endpoint in chunks"""
    if chunk_size > 2500:
        typer.confirm("Chunk size can be unstable if too high, continue?", abort=True)

    movie_ids, tv_ids = (
        fetch_media_ids(popularity) if first_time else fetch_changed_media_ids()
    )

    print(f"\nAbout to update {len(movie_ids)} movies and {len(tv_ids)} TV shows")

    with httpx.Client(timeout=30) as client:
        for media in zip(["movies", "tv shows"], [movie_ids, tv_ids]):
            id_chunks, total_chunks = chunkify(media[1], chunk_size)
            for id_chunk in tqdm(
                id_chunks,
                total=total_chunks,
                desc=f"Updating {media[0]}",
            ):
                client.post("http://internal:8888/update-media", json={"ids": id_chunk})


@app.command()
def remove_blacklisted_from_postgres():
    """Deletes all the ids from blacklist.txt from Postgres, but not MeiliSearch"""
    blacklisted_media = [line.rstrip() for line in open("blacklist.txt")]
    db = database.SessionLocal()

    for id in blacklisted_media:
        delete_media_by_id(db, id)

    db.close()


@app.command()
def remove_blacklisted_from_search():
    blacklisted_media = [line.rstrip() for line in open("blacklist.txt")]
    for country_code in supported_country_codes:
        client.index(f"media_{country_code}").delete_documents(blacklisted_media)

    typer.echo(
        f"Attempted to remove {len(blacklisted_media)} blacklisted media elements in "
        f"{len(supported_country_codes)} indexes"
    )


@app.command()
def remove_non_ascii_media():
    prune_non_ascii_media_from_db()


@app.command()
def remove_all_media():
    db = database.SessionLocal()
    delete_all_media(db=db)
    typer.echo("All media has been deleted")


@app.command()
@coroutine
async def fill_redis():
    """Adds genres and providers to Redis"""
    await insert_genres_to_cache(get_genres())
    await extract_unique_providers_to_cache()


@app.command()
@coroutine
async def refresh_redis():
    """Flushes everything then adds genres and providers to Redis"""
    await redis.flushdb()
    await insert_genres_to_cache(get_genres())
    await extract_unique_providers_to_cache()


@app.command()
@coroutine
async def flush_cache():
    """Flushes everything from Redis"""
    await redis.flushdb()


@app.command()
@coroutine
async def genres_to_cache():
    await insert_genres_to_cache(get_genres())


@app.command()
@coroutine
async def full_setup(popularity: float = 1, first_time: bool = False):
    await insert_genres_to_cache(get_genres())
    update_media(chunk_size=1000, first_time=first_time, popularity=popularity)
    # Removes before indexing MeiliSearch
    remove_blacklisted_from_postgres()
    await extract_unique_providers_to_cache()
    index_meilisearch()


@app.command()
@coroutine
async def providers_to_cache():
    await extract_unique_providers_to_cache()


@app.command()
def remove_and_blacklist(media_id: str):
    try:
        db = database.SessionLocal()
        media = get_media_by_id(db=db, media_id=media_id)
        if not media:
            typer.echo(f"Cannot find media: {media_id}")
            raise typer.Abort()

        typer.confirm(
            f"Are you sure you want to remove & blacklist [{media.title}]?", abort=True
        )

        typer.echo(f"Removing and blacklisting: {media_id}")
        delete_media_by_id(db=db, media_id=media_id)
        typer.echo("Removed from database ✓")

        with open("../blacklist.txt", "a+") as file:
            file.seek(0)
            if media_id in file.read().splitlines():
                typer.echo(f"{media_id} already in blacklist")
            else:
                file.write(f"{media_id}\n")
                typer.echo("Added to blacklist ✓")

        for country_code in supported_country_codes:
            client.index(f"media_{country_code}").delete_document(media_id)

        typer.echo("Meilisearch updated ✓")
        typer.echo(f"{media_id} has succesfully been removed & blacklisted")

    except Exception as e:
        typer.echo(f"An error occoured. {e}")
    finally:
        db.close()


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
