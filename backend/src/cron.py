from tqdm import tqdm
import requests
import typer
from api import get_trending_media_by_total_pages, get_providers, API_URL
from api_helpers import TMDB_KEY
from database_service import dump_media_to_db, dump_genres_to_db, \
    init_meilisearch_indexing, prune_non_ascii_media_from_db
from search import client
from crud import get_all_media, update_media_provider_by_id, delete_all_media
import database

app = typer.Typer()


@app.command()
def update_media(total_pages: int):
    if 1 <= total_pages <= 500:
        try:
            trending_media = get_trending_media_by_total_pages(total_pages)
            # Fills the database with media
            dump_media_to_db(trending_media)
            dump_genres_to_db()

        except Exception as e:
            typer.echo('Failed to add element', e)

        return True
    else:
        typer.echo('Method only supports between 1 & 500 pages')
        return False


@app.command()
def index_meilisearch():
    init_meilisearch_indexing()


@app.command()
def remove_blacklisted_from_search():
    blacklisted_media = [
        line.rstrip() for line in open('../blacklist.txt')
    ]

    client.index('media').delete_documents(blacklisted_media)

    typer.echo(f'Attempted to remove {len(blacklisted_media)} blacklisted media elements')


@app.command()
def remove_non_ascii_media():
    prune_non_ascii_media_from_db()


@app.command()
def remove_all_media():
    db = database.SessionLocal()
    delete_all_media(db=db)
    typer.echo('All media has been deleted')


@app.command()
def add_provider_to_media():
    db = database.SessionLocal()
    media = get_all_media(db)
    media_ids = [media.id for media in media]
    pbar_media_ids = tqdm(media_ids)
    pbar_media_ids.set_description('Adding providers to media')

    for media_id in pbar_media_ids:
        try:
            if media_id[0] == 'm':
                search_url = f'{API_URL}movie/{media_id[1:]}?api_key={TMDB_KEY}' \
                                   f'&append_to_response=watch/providers'

            elif media_id[0] == 't':
                search_url = f'{API_URL}tv/{media_id[1:]}?api_key={TMDB_KEY}' \
                                f'&append_to_response=watch/providers'

            else:
                # skips to next element if id has wrong format
                typer.echo(f'Error in id: {media_id}')
                continue

            media = requests.get(search_url).json()

            media_provider = get_providers(media.get('watch/providers'))
            update_media_provider_by_id(db, media_id, media_provider)

        except Exception as e:
            typer.echo(f'Error in cron.py::add_provider_to_media: {e} | media_id: {media_id}')
            update_media_provider_by_id(db, media_id, [])


@app.command()
def full_setup(total_pages: int, remove_non_ascii: bool = True):
    if update_media(total_pages=total_pages):
        if remove_non_ascii:
            remove_non_ascii_media()
        add_provider_to_media()
        index_meilisearch()
        remove_blacklisted_from_search()


if __name__ == "__main__":
    app()
