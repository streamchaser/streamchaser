from math import ceil

from app import schemas
from app.api import get_genres
from app.config import get_settings
from app.db import crud
from app.db import database
from app.db import models
from app.db.crud import count_all_media
from app.db.database import engine
from app.db.document import Provider
from app.db.models import Media
from app.db.search import client
from sqlalchemy.exc import IntegrityError
from tqdm import tqdm


def media_model_to_schema(media: models.Media) -> schemas.Media:
    """Turns Media-model into a Media-schemas, and adds to Media table"""

    return schemas.Media(
        id=media.get("id"),
        title=media.get("title"),
        original_title=media.get("original_title"),
        overview=media.get("overview"),
        release_date=media.get("release_date"),
        genres=media.get("genres"),
        poster_path=media.get("poster_path"),
        popularity=media.get("popularity"),
    )


def dump_media_to_db(db: database.SessionLocal, media: models.Media) -> None:
    try:
        db_media = crud.get_media_by_id(db=db, media_id=media.id)
        if not db_media:
            crud.create_media(db=db, media=media)
    except IntegrityError:  # Still a bit unsure why this only happens sometimes
        pass
    finally:
        db.close()


def dump_genres_to_db() -> None:
    """Turns a dict of genres into Genre-schemas, and feeds them to crud create"""
    # TODO: connection should probably be done in a safer way
    db = database.SessionLocal()
    genres = get_genres()

    for key in genres:
        formatted_genre = schemas.Genre(
            id=key,
            name=genres[key],
            value=genres[key],
        )

        db_genre = crud.get_genre_by_id(db=db, genre_id=key)
        if not db_genre:
            crud.create_genre(db=db, genre=formatted_genre)
    db.close()


def format_genres() -> None:
    """Finds any genre name containing ampersand (&), formats the name to work with the
    TMDb query, and calls crud update
    """
    db = database.SessionLocal()
    genres = crud.get_all_genres(db=db)

    formatted_genres = [
        schemas.Genre(
            id=genre.id,
            name=str(genre.name).replace(" & ", "%20%26%20"),
            value=genre.name,
        )
        for genre in genres
        if " & " in genre.name
    ]

    for genre in formatted_genres:
        crud.update_genre_name(db, genre)


def init_meilisearch_indexing(chunk_size: int):
    """MeiliSearch indexing from Postgres DB"""
    db = database.SessionLocal()
    all_media_length = count_all_media(db)
    chunk_loops = ceil(all_media_length / chunk_size)  # Will always round up

    with engine.connect() as conn:
        media_stream = conn.execution_options(stream_results=True).execute(
            Media.__table__.select()
        )
        print(
            f"MeiliSearch is about to index "
            f"{len(get_settings().supported_country_codes)} countries"
        )
        with tqdm(total=chunk_loops, desc="Queuing up documents for indexing") as pbar:
            while chunk := media_stream.fetchmany(chunk_size):
                for country_code in get_settings().supported_country_codes:
                    client.index(f"media_{country_code}").add_documents(
                        [
                            schemas.Media(
                                id=media.id,
                                title=media.title,
                                original_title=media.original_title,
                                overview=media.overview,
                                release_date=media.release_date,
                                genres=media.genres,
                                poster_path=media.poster_path,
                                popularity=media.popularity,
                                specific_provider_names=[
                                    provider.get(country_code).get("provider_name")
                                    for provider in media.providers
                                    if provider.get(country_code)
                                ],
                                specific_providers=[
                                    provider.get(country_code)
                                    for provider in media.providers
                                    if provider.get(country_code)
                                ],
                            ).dict()
                            for media in chunk
                        ]
                    )
                pbar.update(1)


# TODO: Move providers to a DB
async def extract_unique_providers_to_txt():
    db = database.SessionLocal()
    media_list = crud.get_all_media(db=db)

    for country_code in get_settings().supported_country_codes:
        provider_set = {
            provider.get(country_code).get("provider_name")
            for media in media_list
            for provider in media.providers
            if provider.get(country_code)
        }

        provider_list = list(provider_set)

        provider = Provider(country_code=country_code, providers=provider_list)
        await Provider.insert_one(provider)

        with open(f"../providers_{country_code}.txt", "w") as file:
            for provider in provider_list:
                file.write(f"{provider}\n")


def prune_non_ascii_media_from_db():
    """Removes media with no genres or Animation that cannot be encoded with ASCII"""

    try:
        db = database.SessionLocal()
        media_list = crud.get_all_media(db=db)
        pbar_media_list = tqdm(media_list)
        pbar_media_list.set_description("Finding non-ASCII in titles")

        for media in pbar_media_list:
            if media.genres.__contains__("Animation") or len(media.genres) == 0:

                for letter in media.original_title:
                    try:
                        letter.encode(encoding="utf-8").decode("ascii")
                    except UnicodeDecodeError:
                        crud.delete_media_by_id(db=db, media_id=media.id)
                        break
        print("Media with non-ASCII titles have been pruned")
    except Exception as e:
        print(e)
