import database
import crud
import schemas
from api_helpers import get_genres
from search import client


def dump_media_to_db(media: list[dict]):
    """Turns a list of dicts into a Media-schemas, and feeds them to crud create
    """
    # TODO: connection should probably be done in a safer way
    db = database.SessionLocal()

    for m in media:
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
            print('Already exists', formatted_media.id)
        else:
            crud.create_media(db=db, media=formatted_media)


def dump_genres_to_db():
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
        if db_genre:
            print('Already exists', formatted_genre)
        else:
            crud.create_genre(db=db, genre=formatted_genre)


def init_meilisearch_indexing():
    """MeiliSearch indexing from Postgres DB
    """
    try:
        db = database.SessionLocal()
        media_list = crud.get_all_media(db=db)

        media_list_as_dict = [
            schemas.Media(
                id=media.id,
                title=media.title,
                original_title=media.original_title,
                overview=media.overview,
                release_date=media.release_date,
                genres=media.genres,
                poster_path=media.poster_path
            ).dict()
            for media in media_list
        ]
        client.index('media').add_documents(media_list_as_dict)
        print(f'Indexing {len(media_list)} media!')

    except Exception as e:
        print(f'Error in {__name__} {e}')
