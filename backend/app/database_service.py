import crud
import database
import schemas
import models

from tqdm import tqdm
from sqlalchemy.exc import IntegrityError

from api_helpers import SUPPORTED_COUNTRY_CODES, get_genres
from search import client


def dump_media_to_db(media: models.Media) -> None:
    """Turns Media-model into a Media-schemas, and adds to Media table"""

    formatted_media = schemas.Media(
        id=media.get("id"),
        title=media.get("title"),
        original_title=media.get("original_title"),
        overview=media.get("overview"),
        release_date=media.get("release_date"),
        genres=media.get("genres"),
        poster_path=media.get("poster_path")
    )
    try:
        db = database.SessionLocal()
        db_media = crud.get_media_by_id(db=db, media_id=formatted_media.id)
        if not db_media:
            crud.create_media(db=db, media=formatted_media)
    except IntegrityError:  # Still a bit unsure why this only happens sometimes
        pass
    finally:
        db.close()


def dump_genres_to_db() -> None:
    """Turns a dict of genres into Genre-schemas, and feeds them to crud create
    """
    # TODO: connection should probably be done in a safer way
    db = database.SessionLocal()
    genres = get_genres()

    for key in genres:
        formatted_genre = schemas.Genre(
            id=key,
            name=genres[key]
        )

        db_genre = crud.get_genre_by_id(db=db, genre_id=key)
        if not db_genre:
            crud.create_genre(db=db, genre=formatted_genre)
    db.close()


def init_meilisearch_indexing():
    """MeiliSearch indexing from Postgres DB
    """

    try:
        db = database.SessionLocal()
        media_list = crud.get_all_media(db=db)

        for country_code in SUPPORTED_COUNTRY_CODES:
            media_list_as_dict = [
                schemas.Media(
                    id=media.id,
                    title=media.title,
                    original_title=media.original_title,
                    overview=media.overview,
                    release_date=media.release_date,
                    genres=media.genres,
                    poster_path=media.poster_path,
                    specific_provider_names=[
                        provider.get(country_code).get('provider_name')
                        for provider in media.providers
                        if provider.get(country_code)
                    ],
                    specific_providers=[
                        provider.get(country_code)
                        for provider in media.providers
                        if provider.get(country_code)
                    ]
                ).dict()
                for media in media_list
            ]
            client.index(f'media_{country_code}').add_documents(media_list_as_dict)

            extract_unique_providers_to_txt(media_list, country_code)

        print(
            f'Meilisearch indexing {len(SUPPORTED_COUNTRY_CODES)} x '
            f'{len(media_list)} elements'
        )

    except Exception as e:
        print(f'Error in database_service.py::init_meilisearch_indexing {e}')


def extract_unique_providers_to_txt(media_list, country_code):
    provider_set = {
        provider.get(country_code).get('provider_name')
        for media in media_list
        for provider in media.providers
        if provider.get(country_code)
    }
    ordered_provider_list = sorted(provider_set)
    with open(f'../providers_{country_code}.txt', 'w') as file:
        for provider in ordered_provider_list:
            file.write(f'{provider}\n')


def prune_non_ascii_media_from_db():
    """Removes media with no genres or Animation that cannot be encoded with ASCII
    """

    try:
        db = database.SessionLocal()
        media_list = crud.get_all_media(db=db)
        pbar_media_list = tqdm(media_list)
        pbar_media_list.set_description('Finding non-ASCII in titles')

        for media in pbar_media_list:
            if media.genres.__contains__('Animation') or len(media.genres) == 0:

                for letter in media.original_title:
                    try:
                        letter.encode(encoding='utf-8').decode('ascii')
                    except UnicodeDecodeError:
                        crud.delete_media_by_id(db=db, id=media.id)
                        break
        print('Media with non-ASCII titles have been pruned')
    except Exception as e:
        print(e)