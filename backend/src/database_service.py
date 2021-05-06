import database
import crud
import schemas
from search import movies_tv_index


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
        movies_tv_index.add_documents(media_list_as_dict)
    except Exception as e:
        print(f'Error in {__name__} {e}')
