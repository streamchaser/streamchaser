from dotenv import dotenv_values
import requests

TMDB_KEY = dotenv_values('.env')['TMDB_API_KEY']


def valid_title(movie: dict) -> str:
    if movie.get('media_type') == 'movie':
        return movie.get('title')

    return movie.get('name')


def valid_release_date(movie: dict) -> str:
    if movie.get('media_type') == 'movie':
        return movie.get('release_date')

    return movie.get('first_air_date')


def get_movie_length(total_minutes: int) -> str:
    """ Formats minutes into following format: 0h 20m
    """
    hours = total_minutes // 60
    minutes = total_minutes % 60
    return f'{hours}h {minutes}m'


def get_genres() -> dict:
    """Gets genres from movies and tv-series to translate genre_ids
    """
    movie_url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_KEY}'
    tv_url = f'https://api.themoviedb.org/3/genre/tv/list?api_key={TMDB_KEY}'

    movie_genres = requests.get(movie_url).json()
    tv_genres = requests.get(tv_url).json()

    # Gets genres from movies and tv-series
    movie_genre_dict = {
        genre['id']: genre['name'] for genre in movie_genres['genres']
    }
    tv_genre_dict = {
        genre['id']: genre['name'] for genre in tv_genres['genres']
    }

    # Only keeps the unique keys
    return movie_genre_dict | tv_genre_dict