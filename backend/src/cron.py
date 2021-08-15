from tqdm.contrib.concurrent import process_map
import typer
from api import get_trending_media_by_total_pages
from api_helpers import SUPPORTED_COUNTRY_CODES
from database_service import dump_media_to_db, dump_genres_to_db, \
    init_meilisearch_indexing, prune_non_ascii_media_from_db
from search import client
from crud import get_all_media, update_media_provider_by_id, delete_all_media, request_providers
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
    for country_code in SUPPORTED_COUNTRY_CODES:
        client.index(f'media_{country_code}').delete_documents(blacklisted_media)

    typer.echo(f'Attempted to remove {len(blacklisted_media)} blacklisted media elements in '
               f'{len(SUPPORTED_COUNTRY_CODES)} indexes')


@app.command()
def remove_non_ascii_media():
    prune_non_ascii_media_from_db()


@app.command()
def remove_all_media():
    db = database.SessionLocal()
    delete_all_media(db=db)
    typer.echo('All media has been deleted')


@app.command()
def add_providers():
    db = database.SessionLocal()
    all_media = get_all_media(db)

    # returns a list of dicts with media ids and provider data
    providers = process_map(request_providers, all_media, desc="Adding providers to media")

    for provider in providers:
        update_media_provider_by_id(db, provider.get('media_id'), provider.get('data'))


@app.command()
def full_setup(total_pages: int, remove_non_ascii: bool = True):
    if update_media(total_pages=total_pages):
        if remove_non_ascii:
            remove_non_ascii_media()
        add_providers()
        index_meilisearch()
        remove_blacklisted_from_search()


if __name__ == "__main__":
    app()
