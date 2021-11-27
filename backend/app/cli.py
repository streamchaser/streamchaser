import gzip
import json
import os
from typing import Optional

import typer
from app.api import fetch_jsongz_files
from app.api import fetch_trending_movies
from app.api import fetch_trending_tv
from app.api import media_converter
from app.api import request_data
from app.config import get_settings
from app.db import database
from app.db.crud import delete_all_media
from app.db.crud import delete_media_by_id
from app.db.crud import get_all_media
from app.db.crud import get_media_by_id
from app.db.crud import update_media_provider_by_id
from app.db.database_service import dump_genres_to_db, media_model_to_schema
from app.db.database_service import dump_media_to_db
from app.db.database_service import format_genres
from app.db.database_service import init_meilisearch_indexing
from app.db.database_service import prune_non_ascii_media_from_db
from app.db.search import client
from app.db.search import update_index
from tqdm import tqdm
from tqdm.contrib.concurrent import process_map


supported_country_codes = get_settings().supported_country_codes

app = typer.Typer()


@app.command()
def fetch_jsongz():
    fetch_jsongz_files()


@app.command()
def new_fetch_media(popularity: float = 0):
    fetch_jsongz_files()

    directory = '../json.gz_dumps'
    data = []

    for file in tqdm(os.listdir(directory), desc='Running through json.gz files'):
        with gzip.open(os.path.join(directory, file), 'r') as f:
            for line in f:
                if (json.loads(line).get('popularity') >= popularity
                        and not json.loads(line).get('adult')):
                    if 'movie' in file:
                        item = json.loads(line)
                        item['id'] = 'm'+str(item['id'])
                        data.append(item)
                    else:
                        item = json.loads(line)
                        item['id'] = 't'+str(item['id'])
                        data.append(item)

    data_length = len(data)

    typer.echo(f'media elements: {data_length} with popularity >= {popularity}')

    media = media_converter(data)

    media_schema_iter = map(media_model_to_schema, media)

    db = database.SessionLocal()
    for media in tqdm(media_schema_iter, total=data_length, desc='Dumping media to database'):
        dump_media_to_db(db=db, media=media)


@app.command()
def index_meilisearch():
    typer.echo("Meilisearch is indexing...")
    init_meilisearch_indexing()
    update_index()
    typer.echo("Meilisearch done indexing!")


@app.command()
def cleanup_genres():
    format_genres()


@app.command()
def remove_blacklisted_from_search():
    blacklisted_media = [
        line.rstrip() for line in open('../blacklist.txt')
    ]
    for country_code in supported_country_codes:
        client.index(f'media_{country_code}').delete_documents(blacklisted_media)

    typer.echo(
        f'Attempted to remove {len(blacklisted_media)} blacklisted media elements in '
        f'{len(supported_country_codes)} indexes'
    )


@app.command()
def remove_non_ascii_media():
    prune_non_ascii_media_from_db()


@app.command()
def remove_all_media():
    db = database.SessionLocal()
    delete_all_media(db=db)
    typer.echo('All media has been deleted')


@app.command()
def add_data():
    db = database.SessionLocal()
    all_media = get_all_media(db)
    db.close()

    # returns a list of dicts with media ids and provider data
    media_data = process_map(
        request_data, all_media, chunksize=25, desc="Fetching media data"
    )

    for data in tqdm(media_data, desc="Updating database with media data"):
        update_media_provider_by_id(db=db, media_id=data.get('media_id'), data=data)


@app.command()
def full_setup(popularity: Optional[float], remove_non_ascii: bool = False):
    new_fetch_media(popularity if popularity else 0)
    if remove_non_ascii:
        remove_non_ascii_media()
    add_data()
    dump_genres_to_db()
    cleanup_genres()
    index_meilisearch()
    update_index()
    remove_blacklisted_from_search()


@app.command()
def remove_and_blacklist(media_id: str):
    try:
        db = database.SessionLocal()
        media = get_media_by_id(db=db, media_id=media_id)
        if not media:
            typer.echo(f'Cannot find media: {media_id}')
            raise typer.Abort()

        typer.confirm(
            f'Are you sure you want to remove & blacklist [{media.title}]?',
            abort=True
        )

        typer.echo(f'Removing and blacklisting: {media_id}')
        delete_media_by_id(db=db, media_id=media_id)
        typer.echo('Removed from database ✓')

        with open('../blacklist.txt', 'a+') as file:
            file.seek(0)
            if media_id in file.read().splitlines():
                typer.echo(f'{media_id} already in blacklist')
            else:
                file.write(f'{media_id}\n')
                typer.echo('Added to blacklist ✓')

        for country_code in supported_country_codes:
            client.index(f'media_{country_code}').delete_document(media_id)

        typer.echo('Meilisearch updated ✓')
        typer.echo(f'{media_id} has succesfully been removed & blacklisted')

    except Exception as e:
        typer.echo(f'An error occoured. {e}')
    finally:
        db.close()


if __name__ == "__main__":
    app()
