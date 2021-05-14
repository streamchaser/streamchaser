import database
import crud
import schemas
from api_helpers import get_genres
from search import client
from tqdm import tqdm


def dump_media_to_db(media: list[dict]):
    """Turns a list of dicts into a Media-schemas, and feeds them to crud create
    """
    # TODO: connection should probably be done in a safer way
    db = database.SessionLocal()
    already_exists_list = []
    pbar_media = tqdm(media)
    pbar_media.set_description('Dumping media to DB')

    for m in pbar_media:
        formatted_media = schemas.Media(
            id=m.get('id'),
            title=m.get('title'),
            original_title=m.get('original_title'),
            overview=m.get('overview'),
            release_date=m.get('release_date'),
            genres=m.get('genres'),
            poster_path=m.get('poster_path')
        )

        db_media = crud.get_media_by_id(db=db, media_id=formatted_media.id)
        if db_media:
            already_exists_list.append(formatted_media.id)
        else:
            crud.create_media(db=db, media=formatted_media)
    print(f'Number of media elements that already existed: {len(already_exists_list)}')


def dump_genres_to_db():
    """Turns a dict of genres into Genre-schemas, and feeds them to crud create
    """
    # TODO: connection should probably be done in a safer way
    db = database.SessionLocal()
    genres = get_genres()
    already_exists_list = []

    for key in genres:
        formatted_genre = schemas.Genre(
            id=key,
            name=genres[key]
        )

        db_genre = crud.get_genre_by_id(db=db, genre_id=key)
        if db_genre:
            already_exists_list.append(formatted_genre.name)
        else:
            crud.create_genre(db=db, genre=formatted_genre)

    print(f'Number of Genres that already existed: {len(already_exists_list)}')


def init_meilisearch_indexing():
    """MeiliSearch indexing from Postgres DB
    """
    try:
        db = database.SessionLocal()
        media_list = crud.get_all_media(db=db)

        pbar_media_list = tqdm(media_list)
        pbar_media_list.set_description('Attaching specific providers to ALL DB elements')

        media_list_as_dict = [
            schemas.Media(
                id=media.id,
                title=media.title,
                original_title=media.original_title,
                overview=media.overview,
                release_date=media.release_date,
                genres=media.genres,
                poster_path=media.poster_path,
                providers=None,  # Placeholder for the full provider JSON
                specific_provider_names=[
                    provider.get('DK').get('provider_name')
                    for provider in media.providers
                    if provider.get('DK')
                ],
                specific_providers=[
                    provider.get('DK')
                    for provider in media.providers
                    if provider.get('DK')
                ]
            ).dict()
            for media in pbar_media_list
        ]
        client.index('media').add_documents(media_list_as_dict)
        print(f'Milisearch indexing {len(media_list)} elements...')

        extract_unique_providers_to_txt(media_list)

    except Exception as e:
        print(f'Error in database_service.py::init_meilisearch_indexing {e}')


def extract_unique_providers_to_txt(media_list):
    provider_set = {
        provider.get('DK').get('provider_name')
        for media in media_list
        for provider in media.providers
        if provider.get('DK')
    }
    ordered_provider_list = sorted(provider_set)
    with open('../providers.txt', 'w') as file:
        for provider in ordered_provider_list:
            file.write(f'{provider}\n')
