import database
import models
import crud
import schemas


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

        db_media = crud.get_media(db=db, media_id=formatted_media.id)
        if db_media:
            print('Already exists', formatted_media.id)
        else:
            crud.create_media(db=db, media=formatted_media)