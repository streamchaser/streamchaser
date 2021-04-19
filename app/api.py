import requests
from dotenv import dotenv_values


TMDB_KEY = dotenv_values('.env')['TMDB_API_KEY']


def get_trending_movies(media_type: str = 'all',
                        time_window: str = 'week') -> dict[any]:
    """
    :param media_type: 'all', 'movie', 'tv', 'person'
    :param time_window: 'week', 'day'
    """
    url = f'https://api.themoviedb.org/3/trending/{media_type}/{time_window}?api_key={TMDB_KEY}'
    return requests.get(url).json()


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
