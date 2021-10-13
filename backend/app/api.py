from typing import Dict
from typing import List

import requests

from backend.app.api_helpers import get_providers
from backend.app.api_helpers import unique_id
from backend.app.api_helpers import valid_original_title
from backend.app.api_helpers import valid_release_date
from backend.app.api_helpers import valid_title
from backend.app.config import get_settings
from backend.app.db import models
from backend.app.schemas import Media
from backend.app.schemas import Movie
from backend.app.schemas import Person
from backend.app.schemas import TV


tmdb_url = get_settings().tmdb_url
tmdb_key = get_settings().tmdb_key


def fetch_trending_movies(page: int) -> Dict:
    url = f'{tmdb_url}trending/movie/week?api_key={tmdb_key}&page={page}'
    return requests.get(url).json()["results"]


def fetch_trending_tv(page: int) -> Dict:
    url = f'{tmdb_url}trending/tv/week?api_key={tmdb_key}&page={page}'
    return requests.get(url).json()["results"]


def media_converter(mixed_list: List[Dict]) -> List[Media]:
    """Takes a list movie/tv json ["results"] and converts it to Media"""
    movie_url = 'https://api.themoviedb.org/3/genre/movie/list?' \
                f'api_key={tmdb_key}'
    tv_url = 'https://api.themoviedb.org/3/genre/tv/list?' \
             f'api_key={tmdb_key}'

    movie_genres = requests.get(movie_url).json()
    tv_genres = requests.get(tv_url).json()

    movie_genre_dict = {
        genre['id']: genre['name'] for genre in movie_genres['genres']
    }
    tv_genre_dict = {
        genre['id']: genre['name'] for genre in tv_genres['genres']
    }

    # Only keeps the unique keys
    genre_dict = {**movie_genre_dict, **tv_genre_dict}

    return [
        # pydantic Media schema
        Media(
            id=unique_id(media),
            title=valid_title(media),
            original_title=valid_original_title(media),
            overview=media.get('overview'),
            release_date=valid_release_date(media),
            genres=[
                genre_dict.get(genre_id) for genre_id in media.get('genre_ids')
            ] if media.get('genre_ids') else ['Unknown'],
            poster_path=media.get('poster_path'),
            popularity=media.get('popularity')
        ).dict()
        for media in mixed_list
    ]


async def get_person_from_id(person_id: int):
    """ Gets data of a person from an id
    """
    # Here we make 3 api calls into 1 using the append_to_response header
    url = f'{tmdb_url}person/{person_id}?api_key={tmdb_key}' \
          '&append_to_response=movie_credits,tv_credits'

    person = requests.get(url).json()

    # pydantic schema for a person
    return Person(
        id=person.get('id'),
        name=person.get('name'),
        birthdate=person.get('birthdate'),
        deathday=person.get('deathday'),
        biography=person.get('biography'),
        place_of_birth=person.get('place_of_birth'),
        also_known_as=person.get('also_known_as'),
        profile_path=person.get('profile_path'),
        gender=person.get('gender'),
        movie_credits=person.get('movie_credits').get('cast'),
        tv_credits=person.get('tv_credits').get('cast')
    )


def get_movie_from_id(movie_id: int, country_code: str = 'DK') -> Movie:
    """ Gets data of a movie from an id
    """
    # Here we make 3 api calls into 1 using the append_to_response header
    url = f'{tmdb_url}movie/{movie_id}?api_key={tmdb_key}' \
          '&append_to_response=watch/providers,recommendations,credits'

    movies = requests.get(url).json()

    # pydantic schema for a movie
    return Movie(
        id=movies.get('id'),
        title=movies.get('title'),
        release_date=movies.get('release_date'),
        overview=movies.get('overview'),
        genres=[
            genre.get('name') for genre in movies.get('genres')
        ],
        imdb_id=movies.get('imdb_id'),
        runtime=movies.get('runtime'),
        providers=get_providers(movies.get('watch/providers'), country_code),
        recommendations=get_recommendations(movies.get('recommendations')),
        poster_path=movies.get('poster_path'),
        cast=movies.get('credits').get('cast'),
        popularity=movies.get('popularity'),
        backdrop_path=movies.get('backdrop_path')
    )


def get_tv_from_id(tv_id: int, country_code: str = 'DK') -> TV:
    """ Gets data of a tv series from an id
    """
    # Here we make 3 api calls into 1 using the append_to_response header
    url = f'{tmdb_url}tv/{tv_id}?api_key={tmdb_key}' \
          '&append_to_response=watch/providers,recommendations,credits'

    tv = requests.get(url).json()

    # pydantic schema for a tv series
    return TV(
        id=tv.get('id'),
        name=tv.get('name'),
        first_air_date=tv.get('first_air_date'),
        overview=tv.get('overview'),
        genres=[
            genre.get('name') for genre in tv.get('genres')
        ],
        episode_run_time=tv.get('episode_run_time'),
        providers=get_providers(tv.get('watch/providers'), country_code),
        recommendations=get_recommendations(tv.get('recommendations')),
        poster_path=tv.get('poster_path'),
        popularity=tv.get('popularity'),
        number_of_seasons=tv.get('number_of_seasons'),
        seasons=tv.get('seasons'),
        backdrop_path=tv.get('backdrop_path'),
        cast=tv.get('credits').get('cast')
    )


def get_genres() -> Dict:
    """Gets genres from movies and tv-series to translate genre_ids
    """
    movie_url = 'https://api.themoviedb.org/3/genre/movie/list?' \
                f'api_key={tmdb_key}'
    tv_url = 'https://api.themoviedb.org/3/genre/tv/list?' \
             f'api_key={tmdb_key}'

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


def request_providers(media: models.Media):
    tmdb_url = get_settings().tmdb_url
    tmdb_key = get_settings().tmdb_key

    try:
        if media.id[0] == 'm':
            url = f'{tmdb_url}movie/{media.id[1:]}?api_key={tmdb_key}' \
                  '&append_to_response=watch/providers'

        elif media.id[0] == 't':
            url = f'{tmdb_url}tv/{media.id[1:]}?api_key={tmdb_key}' \
                  '&append_to_response=watch/providers'

        media_provider_append = requests.get(url).json()
        return {
            'media_id': media.id,
            'data': get_providers(media_provider_append.get('watch/providers'))
            }

    except Exception as e:
        print(e)


def get_recommendations(recommendations: Dict) -> List[Dict]:
    """ Gets list of recommended movies for a movie
    """

    return [result for result in recommendations['results']]
