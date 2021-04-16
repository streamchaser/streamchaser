from fastapi import FastAPI
from .api import get_trending_movies, get_genres
import json

app = FastAPI()

# Saves the trending moves to 'movies.json'
with open('movies.json', 'w') as output:
    json.dump(get_trending_movies(), output)

# Makes a dict to translate genre ids to their names
genres = get_genres()
genre_dict = {
    genre['id']: genre['name'] for genre in genres['genres']
}

# Reads through 'movies.json' and builds a list of dicts with the desired fields
with open('movies.json') as json_file:
    data = json.load(json_file)
    trending_movies = [
        {
            'title': movie.get('title'),
            'release_date': movie.get('release_date'),
            'genres': [
                genre_dict[genre_id] for genre_id in movie.get('genre_ids')  # Translates the ids
            ]
        }
        for movie in data['results'] if movie.get('title')  # Skips movies with no title
    ]


@app.get('/')
async def root() -> list[dict]:
    """Home page
    """
    return trending_movies
