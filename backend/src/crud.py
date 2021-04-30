from sqlalchemy.orm import Session

import models
import schemas


def get_media(db: Session, media_id: str):
    """Gets a single Media-type by the id
    """
    return db.query(models.Media).filter(models.Media.id == media_id).first()


def get_all_media(db: Session, skip: int = 0, limit: int = 100):
    """Gets all Media-types limited by 'limit'
    """
    return db.query(models.Media).offset(skip).limit(limit).all()


def create_media(db: Session, media: schemas.MediaBase):
    """Adds a Media-type to the database
    """
    db_media = models.Media(
        id=media.id,
        title=media.title,
        original_title=media.original_title,
        release_date=media.release_date,
        genre_ids=media.genre_ids,
        poster_path=media.poster_path
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media
