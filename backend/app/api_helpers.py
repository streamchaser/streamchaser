from typing import Dict, List

import requests
from dotenv import dotenv_values

API_URL = 'https://api.themoviedb.org/3/'
TMDB_KEY = dotenv_values('../.env').get('TMDB_API_KEY')
SUPPORTED_COUNTRY_CODES = ['DK', 'GB', 'DE', 'SE', 'US']


def valid_title(media: Dict) -> str:
    if media.get('media_type') == 'movie':
        return media.get('title')

    return media.get('name')


def valid_original_title(media: Dict) -> str:
    if media.get('media_type') == 'movie':
        return media.get('original_title')

    return media.get('original_name')


def valid_release_date(media: Dict) -> str:
    if media.get('media_type') == 'movie':
        return str(media.get('release_date'))

    return str(media.get('first_air_date'))


def unique_id(media: Dict) -> str:
    if media.get('media_type') == 'movie':
        return f"m{media.get('id')}"
    elif media.get('media_type') == 'tv':
        return f"t{media.get('id')}"
    elif media.get('media_type') == 'person':
        return f"p{media.get('id')}"
    else:
        print(f"Failed to create unique ID for {media.get('id')}")
        return str(media.get('id'))


def get_movie_length(total_minutes: int) -> str:
    """ Formats minutes into following format: 0h 20m
    """
    hours = total_minutes // 60
    minutes = total_minutes % 60
    return f'{hours}h {minutes}m'


def get_genres() -> Dict:
    """Gets genres from movies and tv-series to translate genre_ids
    """
    movie_url = f'https://api.themoviedb.org/3/genre/movie/list?api_key={TMDB_KEY}'
    tv_url = f'https://api.themoviedb.org/3/genre/tv/list?api_key={TMDB_KEY}'

    movie_genres = requests.get(movie_url).json()
    tv_genres = requests.get(tv_url).json()

    movie_genre_dict = {
        genre['id']: genre['name'] for genre in movie_genres['genres']
    }
    tv_genre_dict = {
        genre['id']: genre['name'] for genre in tv_genres['genres']
    }

    # Only keeps the unique keys
    return {**movie_genre_dict, **tv_genre_dict}


GENRE_DICT = get_genres()


def genre_id_to_str(media: Dict) -> List[str]:
    """Tries to lookup the genres with a list comprehension
    Goes into a for-loop, if there's an error and writes 'Unknown' for the exception
    """
    try:
        return [
            GENRE_DICT[genre_id]
            for genre_id in media.get('genre_ids') if GENRE_DICT[genre_id]
        ]
    except KeyError as e:
        print(f"Failed to lookup {media.get('id')} with a list comp, {e}")
        list_of_genres = []
        for genre_id in media.get('genre_ids'):
            try:
                list_of_genres.append(GENRE_DICT[genre_id])
            except KeyError as e:
                print(f'Unknown genre id {e}')
                list_of_genres.append('Unknown')
        return list_of_genres
