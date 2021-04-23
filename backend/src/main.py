import json

from api import *
from search import *

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

# Saves the trending moves to 'movies.json'
with open('../movies.json', 'w') as output:
    json.dump(get_all_movies(), output)

# Reads through 'movies.json' and builds a list of dicts with the desired fields
with open('../movies.json') as json_file:
    data = json.load(json_file)
    trending_movies = [
        {
            'id': movie.get('id'),
            'title': valid_title(movie),
            'release_date': valid_release_date(movie),
            'genres': [
                # Translates the ids
                GENRE_DICT[genre_id] for genre_id in movie.get('genre_ids')
            ]
        }
        for movie in data
    ]

# Meilisearch indexing of trending_movies
movies_tv_index.add_documents(trending_movies)


@app.get('/')
async def root() -> list[dict]:
    """Home page
    """
    return trending_movies


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
