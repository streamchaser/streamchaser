from search import *
from api import *
from helpers import *

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


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

save_to_json('../trending_media.json', get_all_media())

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
