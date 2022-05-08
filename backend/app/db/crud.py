from app import schemas
from app.db import models
from sqlalchemy.orm import Session


def get_media_by_id(db: Session, media_id: str):
    """Gets a single Media-type by the id"""
    return db.query(models.Media).filter(models.Media.id == media_id).first()


def get_all_media(db: Session, skip: int = 0, limit: int = 0) -> list[models.Media]:
    """Gets all Media-types limited by 'limit'"""
    if not limit:
        return db.query(models.Media).all()

    return db.query(models.Media).offset(skip).limit(limit).all()


def get_new_media_by_id(db: Session, media_id: str):
    """Gets a single Media-type by the id"""
    return db.query(models.NewMedia).filter(models.NewMedia.id == media_id).first()


def get_all_new_media(db: Session, skip: int = 0, limit: int = 0):
    """Gets all Media-types limited by 'limit'"""
    if not limit:
        return db.query(models.NewMedia).all()

    return db.query(models.NewMedia).offset(skip).limit(limit).all()


def get_all_media_iter(db: Session):
    return db.query(models.Media)


def count_all_media(db: Session) -> int:
    return db.query(models.Media).count()


def create_media(db: Session, media: schemas.Media):
    """Adds a Media-type to the database"""
    db_media = models.Media(
        id=media.id,
        title=media.title,
        original_title=media.original_title,
        overview=media.overview,
        release_date=media.release_date,
        genres=media.genres,
        poster_path=media.poster_path,
        popularity=media.popularity,
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media


def update_media_data_by_id(db: Session, media_id: str, data: dict):
    db.query(models.Media).filter_by(id=media_id).update(
        {
            "genres": data.get("genres"),
            "flatrate_providers": data.get("flatrate_providers"),
            "free_providers": data.get("free_providers"),
            "title": data.get("title"),
            "poster_path": data.get("poster_path"),
            "popularity": data.get("popularity"),
        }
    )
    db.commit()


def delete_media_by_id(db: Session, media_id: str):
    db.query(models.Media).filter_by(id=media_id).delete()
    db.commit()


def delete_all_media(db: Session):
    db.query(models.Media).delete()
    db.commit()
