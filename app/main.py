from fastapi import FastAPI
from .api import get_trending_movies, get_genres
from .search import index
import json


app = FastAPI()

# Saves the trending moves to 'movies.json'
with open('movies.json', 'w') as output:
    json.dump(get_trending_movies(), output)

# Makes a dict to translate genre ids to their names
genre_dict = get_genres()

# Reads through 'movies.json' and builds a list of dicts with the desired fields
with open('movies.json') as json_file:
    data = json.load(json_file)
    trending_movies = [
        {
            'id': movie.get('id'),
            'title': movie.get('title'),
            'release_date': movie.get('release_date'),
            'genres': [
                genre_dict[genre_id] for genre_id in movie.get('genre_ids')
                # genre_dict[genre_id] for genre_id in movie.get('genre_ids') if movie.get('genre_ids')  # Translates the ids
            ]
        }
        for movie in data['results']
    ]

# Meilisearch indexing of trending_movies
index.add_documents(trending_movies)


@app.get('/')
async def root() -> list[dict]:
    print(index.search('thunder'))
    """Home page
    """
    return trending_movies
