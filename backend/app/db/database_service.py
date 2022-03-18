import json

from app import schemas
from app.config import get_settings
from app.db import crud
from app.db import database
from app.db import models
from app.db.cache import Genre
from app.db.cache import redis
from app.db.crud import get_all_media
from app.db.search import client
from app.util import unique_list
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


async def insert_genres_to_cache(genres: dict) -> None:
    """Turns a dict of genres into Genre-schemas, and feeds them to crud create"""

    fixed_genres = [
        Genre(
            label=genre,
            value=genre.replace(" & ", "%20%26%20"),
        ).dict()
        if " & " in genre
        else Genre(label=genre, value=genre).dict()
        for genre in genres.values()
    ]

    await redis.set("genres", json.dumps(fixed_genres))


def index_media(country_code: str, media: list):
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
                provider_names=[
                    provider.get(country_code).get("provider_name")
                    for provider in unique_list(
                        media.flatrate_providers, media.free_providers
                    )
                    if provider.get(country_code)
                ],
                providers=[
                    provider.get(country_code)
                    for provider in unique_list(
                        media.flatrate_providers, media.free_providers
                    )
                    if provider.get(country_code)
                ],
            ).dict()
            for media in media
        ]
    )


def init_meilisearch_indexing():
    """MeiliSearch indexing from Postgres DB"""
    db = database.SessionLocal()
    media: list = get_all_media(db)
    country_codes = get_settings().supported_country_codes

    for country_code in tqdm(
        country_codes, desc=f"Indexing {len(country_codes)} countries"
    ):
        index_media(country_code, media)


async def extract_unique_providers_to_cache():
    db = database.SessionLocal()
    media_list = crud.get_all_media(db=db)

    for country_code in get_settings().supported_country_codes:
        free_provider_set = {
            provider.get(country_code).get("provider_name")
            for media in media_list
            for provider in media.free_providers
            if provider.get(country_code)
        }
        flatrate_provider_set = {
            provider.get(country_code).get("provider_name")
            for media in media_list
            for provider in media.flatrate_providers
            if provider.get(country_code)
        }
        ordered_free_provider_list = sorted(free_provider_set)
        ordered_flatrate_provider_list = sorted(flatrate_provider_set)

        await redis.set(
            f"{country_code}_free_providers", json.dumps(ordered_free_provider_list)
        )
        await redis.set(
            f"{country_code}_flatrate_providers",
            json.dumps(ordered_flatrate_provider_list),
        )


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
