import gzip
import json
import math
import os
from concurrent.futures import ThreadPoolExecutor
from typing import Optional

import httpx
import typer
from app.api import fetch_changed_media_ids
from app.api import fetch_jsongz_files
from app.api import fetch_media_ids
from app.api import get_genres
from app.api import media_converter
from app.api import request_data
from app.config import get_settings
from app.db import database
from app.db.cache import redis
from app.db.crud import count_all_media
from app.db.crud import delete_all_media
from app.db.crud import delete_media_by_id
from app.db.crud import get_media_by_id
from app.db.crud import update_media_data_by_id
from app.db.database import engine
from app.db.database_service import dump_media_to_db
from app.db.database_service import extract_unique_providers_to_cache
from app.db.database_service import init_meilisearch_indexing
from app.db.database_service import insert_genres_to_cache
from app.db.database_service import media_model_to_schema
from app.db.database_service import prune_non_ascii_media_from_db
from app.db.models import Media
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
def fetch_media(popularity: float = 0):
    fetch_jsongz_files()

    directory = "../json.gz_dumps"
    data = []

    for file in tqdm(os.listdir(directory), desc="Running through json.gz files"):
        with gzip.open(os.path.join(directory, file), "r") as f:
            for line in f:
                if json.loads(line).get("popularity") >= popularity and not json.loads(
                    line
                ).get("adult"):
                    if "movie" in file:
                        item = json.loads(line)
                        item["id"] = "m" + str(item["id"])
                        data.append(item)
                    else:
                        item = json.loads(line)
                        item["id"] = "t" + str(item["id"])
                        data.append(item)

    data_length = len(data)

    typer.echo(f"media elements: {data_length} with popularity >= {popularity}")

    media = media_converter(data)

    media_schema_iter = map(media_model_to_schema, media)

    db = database.SessionLocal()
    for media in tqdm(
        media_schema_iter, total=data_length, desc="Dumping media to database"
    ):
        dump_media_to_db(db=db, media=media)


@app.command()
def index_meilisearch():
    init_meilisearch_indexing()
    update_index()


@app.command()
def update_ids(ids: list[str]):
    with httpx.Client() as client:
        client.post("http://internal:8888/update-media", json={"ids": ids})


@app.command()
def update_media(
    chunk_size: int = 1000, first_time: bool = False, popularity: float = 0
):
    """Sends media ids to our internal update-media endpoint in chunks"""
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
def add_data():
    db = database.SessionLocal()
    chunk_size = 1000
    all_media_length = count_all_media(db)
    chunk_loops = math.ceil(all_media_length / chunk_size)  # Will always round up

    with engine.connect() as conn:
        media_stream = conn.execution_options(stream_results=True).execute(
            Media.__table__.select()
        )

        typer.echo(f"Processing {all_media_length} media in {chunk_loops} chunks")
        with tqdm(
            total=chunk_loops, desc="Updating media and dumping to DB"
        ) as progress_bar:
            while chunk := media_stream.fetchmany(chunk_size):
                with ThreadPoolExecutor() as executor:
                    media_data = executor.map(request_data, chunk)

                for data in media_data:
                    update_media_data_by_id(
                        db=db, media_id=data.get("media_id"), data=data
                    )

                progress_bar.update(1)
    db.close()


@app.command()
@coroutine
async def flush_cache():
    await redis.flushdb()


@app.command()
@coroutine
async def genres_to_cache():
    await insert_genres_to_cache(get_genres())


@app.command()
@coroutine
async def full_setup(popularity: Optional[float], remove_non_ascii: bool = False):
    await insert_genres_to_cache(get_genres())
    fetch_media(popularity if popularity else 0)
    if remove_non_ascii:
        remove_non_ascii_media()
    add_data()
    init_meilisearch_indexing()
    update_index()
    await extract_unique_providers_to_cache()
    remove_blacklisted_from_search()


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


if __name__ == "__main__":
    app()
