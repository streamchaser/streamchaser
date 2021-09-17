from typing import Dict, List

import requests
from sqlalchemy.orm import Session

import models
import schemas
from api import get_providers
from config import get_settings


def get_media_by_id(db: Session, media_id: str):
    """Gets a single Media-type by the id
    """
    return db.query(models.Media).filter(models.Media.id == media_id).first()


def get_all_media(db: Session, skip: int = 0, limit: int = 50000):
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


def update_media_provider_by_id(db: Session, id: str, providers: List[Dict]):
    db.query(models.Media).filter_by(id=id).update({
        'providers': providers
    })
    db.commit()


def delete_media_by_id(db: Session, id: str):
    db.query(models.Media).filter_by(id=id).delete()
    db.commit()


def delete_all_media(db: Session):
    db.query(models.Media).delete()
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
        name=genre.name,
        value=genre.value
    )
    db.add(db_genre)
    db.commit()
    return db_genre


def update_genre_name(db: Session, genre: schemas.Genre):
    db_genre = models.Genre(
        id=genre.id,
        name=genre.name,
        value=genre.value
    )

    db.query(models.Genre).filter_by(id=genre.id).update({
        'name': db_genre.name
    })
    db.commit()


def request_providers(media: models.Media):
    try:
        if media.id[0] == 'm':
            search_url = f'{get_settings().tmdb_url}movie/{media.id[1:]}' \
                          '?api_key={get_settings().tmdb_key}' \
                          '&append_to_response=watch/providers'

        elif media.id[0] == 't':
            search_url = f'{get_settings().tmdb_url}tv/{media.id[1:]}' \
                          '?api_key={get_settings().tmdb_key}' \
                          '&append_to_response=watch/providers'

        media_provider_append = requests.get(search_url).json()
        return {
            'media_id': media.id,
            'data': get_providers(media_provider_append.get('watch/providers'))
            }

    except Exception as e:
        print(e)
