import typer
from api import get_trending_media_by_total_pages
from search import movies_tv_index
import database_service


app = typer.Typer()


@app.command()
def update_media(total_pages: int):
    try:
        trending_media = get_trending_media_by_total_pages(total_pages)

        # Fills the database with media
        database_service.dump_media_to_db(trending_media)

        # Meilisearch indexing of trending_movies
        movies_tv_index.add_documents(trending_media)
    except Exception as e:
        typer.echo('Failed to add element', e)

    remove_adult()
    typer.echo(f'Media has been updated with {(total_pages - 1) * 40} new elements')


@app.command()
def remove_adult():
    blacklisted_media = [
        movies_tv_index.delete_document(line.rstrip())
        for line in open('../blacklist.txt')
    ]

    typer.echo(f'Attempted to remove {len(blacklisted_media)} blacklisted media elements')


if __name__ == "__main__":
    app()
