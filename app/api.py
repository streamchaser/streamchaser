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
    url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_KEY}'
    return requests.get(url).json()
