import typer
from api import get_trending_media_by_total_pages
from database_service import dump_media_to_db, dump_genres_to_db, \
    init_meilisearch_indexing
from search import client


app = typer.Typer()


@app.command()
def update_media(total_pages: int):
    try:
        trending_media = get_trending_media_by_total_pages(total_pages)

        # Fills the database with media
        dump_media_to_db(trending_media)
        dump_genres_to_db()

        # Meilisearch indexing of trending_movies
        init_meilisearch_indexing()
    except Exception as e:
        typer.echo('Failed to add element', e)

    remove_adult()
    typer.echo(f'Media has been updated with {(total_pages - 1) * 40} new elements')


@app.command()
def remove_adult():
    blacklisted_media = [
        client.index('media').delete_document(line.rstrip())
        for line in open('../blacklist.txt')
    ]

    typer.echo(f'Attempted to remove {len(blacklisted_media)} blacklisted media elements')


if __name__ == "__main__":
    app()
