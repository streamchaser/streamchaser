import json

from helpers import *
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
with open('movies.json', 'w') as output:
    json.dump(get_all_movies(), output)

# Makes a dict to translate genre ids to their names
genre_dict = get_genres()


# Reads through 'movies.json' and builds a list of dicts with the desired fields
with open('movies.json') as json_file:
    data = json.load(json_file)
    trending_movies = [
        {
            'id': movie.get('id'),
            'title': valid_title(movie),
            'release_date': valid_release_date(movie),
            'genres': [
                genre_dict[genre_id] for genre_id in movie.get('genre_ids')  # Translates the ids
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
