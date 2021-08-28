from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import api
import crud
import models
import schemas
import database

from search import client
from schemas import Movie, TV

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = [
    'http://localhost:8080',
    'http://localhost:5000',  # TODO: Remove when old_frontend is deleted
    'http://localhost:3000',
    'http://localhost',
    'https://localhost',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.get('/', response_model=list[schemas.Media])
async def root(db: Session = Depends(database.get_db)) -> list[dict]:
    """Home page
    """
    return crud.get_all_media(db, skip=0, limit=1000)


@app.get('/search/{user_input}')
async def search(user_input: str,
                 c: str,
                 g: Optional[List[str]] = Query(None),
                 p: Optional[List[str]] = Query(None)):
    """
    # Our endpoint for the MeiliSearch API
    * **user_input**: Input to lookup media
    * **g**: Optional genre query
    * **p**: Optional provider query
    """
    genres = g
    providers = p
    country_code = c

    if genres and providers:
        genre_list: list[str] = [
            f'genres="{genre}"' for genre in genres
        ]
        provider_list: list[list[str]] = [
            [f'specific_provider_names="{providers}"'
             for providers in providers]
        ]

        return client.index(f'media_{country_code}').search(user_input, {
            'limit': 21,
            'filter': genre_list + provider_list
        })
    elif genres:
        return client.index(f'media_{country_code}').search(user_input, {
            'limit': 21,
            # This is using AND logic
            'filter': [f'genres="{genre}"' for genre in genres]
        })
    elif providers:
        return client.index(f'media_{country_code}').search(user_input, {
            'limit': 21,
            # This is using OR logic
            'filter': [[f'specific_provider_names="{providers}"'
                        for providers in providers]]
        })
    return client.index(f'media_{country_code}').search(user_input, {'limit': 21})


@app.get('/movie/{country_code}/{movie_id}')
async def get_movie(movie_id: int, country_code: str) -> Movie:
    """Specific Movie page
    """
    return api.get_movie_from_id(movie_id, country_code.upper())


@app.get('/tv/{country_code}/{tv_id}')
async def get_tv(tv_id: int, country_code: str) -> TV:
    """Specific TV page
    """
    return api.get_tv_from_id(tv_id, country_code.upper())


@app.get('/media/{media_id}', response_model=schemas.Media)
async def read_specific_media(media_id: str, db: Session = Depends(database.get_db)):
    """Reads all database media
    """
    db_media = crud.get_media_by_id(db=db, media_id=media_id)
    if db_media:
        return db_media
    raise HTTPException(status_code=404, detail="Media doesn't exist")


@app.get('/media/', response_model=list[schemas.Media])
async def read_all_media(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """Reads all database media
    """
    return crud.get_all_media(db=db, skip=skip, limit=limit)


@app.post('/media/', response_model=schemas.Media)
async def create_media(media: schemas.Media, db: Session = Depends(database.get_db)):
    """Creates a media to the database
    """
    db_media = crud.get_media_by_id(db=db, media_id=media.id)
    if db_media:
        raise HTTPException(status_code=400, detail='Media already exists')
    return crud.create_media(db=db, media=media)


@app.get('/genres/')
async def read_all_genres(db: Session = Depends(database.get_db)):
    """Reads all genres, returns only the name
    """
    db_genres = crud.get_all_genres(db=db)
    return [genre.name for genre in db_genres]


@app.get('/providers/{country_code}')
async def read_all_providers(country_code):
    """Reads all the providers from providers.txt
    """
    return [line.rstrip() for line in open(f'../providers_{country_code}.txt')]
