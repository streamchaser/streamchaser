from sqlalchemy.orm import Session

import models
import schemas


def get_media_by_id(db: Session, media_id: str):
    """Gets a single Media-type by the id
    """
    return db.query(models.Media).filter(models.Media.id == media_id).first()


def get_all_media(db: Session, skip: int = 0, limit: int = 25000):
    """Gets all Media-types limited by 'limit'
    """
    return db.query(models.Media).offset(skip).limit(limit).all()


def create_media(db: Session, media: schemas.Media):
    """Adds a Media-type to the database
    """
    db_media = models.Media(
        id=media.id,
        title=media.title,
        original_title=media.original_title,
        overview=media.overview,
        release_date=media.release_date,
        genres=media.genres,
        poster_path=media.poster_path
    )
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media


def update_media_provider_by_id(db: Session, id: str, providers: list[dict]):
    db.query(models.Media).filter_by(id=id).update({
        'providers': providers
    })
    db.commit()


def get_genre_by_id(db: Session, genre_id: str):
    """Gets a single Media-type by the id
    """
    return db.query(models.Genre).filter(models.Genre.id == genre_id).first()


def get_all_genres(db: Session):
    """Gets all Genre-types
    """
    return db.query(models.Genre).all()


def create_genre(db: Session, genre: schemas.Genre):
    """Adds a Genre-type to the database
    """
    db_genre = models.Genre(
        id=genre.id,
        name=genre.name
    )
    db.add(db_genre)
    db.commit()
    return db_genre
