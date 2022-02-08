import asyncio
import gzip
import json
import math
import os
from concurrent.futures import ThreadPoolExecutor
from functools import wraps
from typing import Optional

import typer
from app.api import fetch_jsongz_files
from app.api import media_converter
from app.api import request_data
from app.config import get_settings
from app.db import database
from app.db.crud import count_all_media
from app.db.crud import delete_all_media
from app.db.crud import delete_media_by_id
from app.db.crud import get_media_by_id
from app.db.crud import update_media_data_by_id
from app.db.database import engine
from app.db.database_service import dump_genres_to_db
from app.db.database_service import dump_media_to_db
from app.db.database_service import extract_unique_providers_to_txt
from app.db.database_service import format_genres
from app.db.database_service import init_meilisearch_indexing
from app.db.database_service import media_model_to_schema
from app.db.database_service import prune_non_ascii_media_from_db
from app.db.document import Provider
from app.db.models import Media
from app.db.search import client
from app.db.search import update_index
from tqdm import tqdm


def coro(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))

    return wrapper


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
    init_meilisearch_indexing(chunk_size=10000)
    update_index()


@app.command()
def cleanup_genres():
    format_genres()


@app.command()
def remove_blacklisted_from_search():
    blacklisted_media = [line.rstrip() for line in open("../blacklist.txt")]
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
async def crap_func():
    provider_list = ["Netflix", "Amazon Prime Video", "Hulu", "Disney+"]
    country_code = "DK"

    provider = Provider(country_code=country_code, providers=provider_list)
    await Provider.insert_one(provider)
    typer.echo("Done pooping!")


@app.command()
@coro
async def hest():
    provider_list = ["Netflix", "Amazon Prime Video", "Hulu", "Disney+"]
    country_code = "DK"

    provider = Provider(country_code=country_code, providers=provider_list)
    await Provider.insert_one(provider)
    typer.echo("Done pooping!")


@coro
@app.command()
def lort():
    typer.echo("Crap")
    loop = asyncio.get_event_loop()
    coroutine = crap_func()
    loop.run_until_complete(coroutine)


@app.command()
def full_setup(popularity: Optional[float], remove_non_ascii: bool = False):
    fetch_media(popularity if popularity else 0)
    if remove_non_ascii:
        remove_non_ascii_media()
    add_data()
    dump_genres_to_db()
    cleanup_genres()
    index_meilisearch()
    asyncio.run(extract_unique_providers_to_txt())
    update_index()
    remove_blacklisted_from_search()


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
