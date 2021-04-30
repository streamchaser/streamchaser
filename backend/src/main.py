from search import *
from api import *
from helpers import *

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
import models
import schemas
import database

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

trending_media = get_all_trending_media()

# Meilisearch indexing of trending_movies
movies_tv_index.add_documents(trending_media)


@app.get('/')
async def root() -> list[dict]:
    """Home page
    """
    return trending_media


@app.get('/search/{input}')
async def search(input: str) -> list[dict]:
    """Search thingy
    """
    return movies_tv_index.search(input)


@app.get('/{country_code}/movie/{movie_id}')
async def get_movie(movie_id: int, country_code: str) -> Movie:
    """Specific Movie page
    """
    return get_movie_from_id(movie_id, country_code.upper())


@app.get('/{country_code}/tv/{tv_id}')
async def get_tv(tv_id: int, country_code: str) -> TV:
    """Specific TV page
    """
    return get_tv_from_id(tv_id, country_code.upper())


@app.get('/media/', response_model=list[schemas.MediaBase])
async def read_all_media(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """Reads all database media
    """
    all_media = crud.get_all_media(db, skip=skip, limit=limit)
    return all_media


@app.post('/media/', response_model=schemas.MediaBase)
async def create_media(media: schemas.MediaBase, db: Session = Depends(database.get_db)):
    """Creates a media to the database
    """
    db_media = crud.get_media(db=db, media_id=media.id)
    if db_media:
        raise HTTPException(status_code=400, detail='Media already exists')
    return crud.create_media(db=db, media=media)
