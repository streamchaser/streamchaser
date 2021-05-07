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
from database_service import init_meilisearch_indexing

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()


origins = [
    'http://localhost:8080',
    'http://localhost:5000',
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

init_meilisearch_indexing()


@app.get('/', response_model=list[schemas.Media])
async def root(db: Session = Depends(database.get_db)) -> list[dict]:
    """Home page
    """
    return crud.get_all_media(db, skip=0, limit=1000)


@app.get('/search/{user_input}')
async def search(user_input: str,
                 g: Optional[List[str]] = Query(None)):
    """
    # Our endpoint for the MeiliSearch API
    * **user_input**: Input to lookup media
    * **g**: Optional genre query
    """
    genres = g
    if genres:
        return client.index('media').search(user_input, {
            'limit': 21,
            'facetFilters': [f'genres:{genre}' for genre in genres]
        })
    return client.index('media').search(user_input, {'limit': 21})


@app.get('/{country_code}/movie/{movie_id}')
async def get_movie(movie_id: int, country_code: str) -> Movie:
    """Specific Movie page
    """
    return api.get_movie_from_id(movie_id, country_code.upper())


@app.get('/{country_code}/tv/{tv_id}')
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
