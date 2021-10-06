from typing import Dict, List

import requests

from api_helpers import (genre_id_to_str, get_movie_length,
                         unique_id, valid_original_title, valid_release_date,
                         valid_title)
from schemas import TV, Media, Movie, Person
from config import get_settings


def fetch_trending_movies(page: int) -> Dict:
    tmdb_url = get_settings().tmdb_url
    tmdb_key = get_settings().tmdb_key

    url = f'{tmdb_url}trending/movie/week?api_key={tmdb_key}&page={page}'

    return requests.get(url).json()["results"]


def fetch_trending_tv(page: int) -> Dict:
    tmdb_url = get_settings().tmdb_url
    tmdb_key = get_settings().tmdb_key

    url = f'{tmdb_url}trending/tv/week?api_key={tmdb_key}&page={page}'

    return requests.get(url).json()["results"]


def media_converter(mixed_list: List[Dict]) -> List[Media]:
    """Takes a list movie/tv json ["results"] and converts it to Media"""
    return [
        # pydantic Media schema
        Media(
            id=unique_id(media),
            title=valid_title(media),
            original_title=valid_original_title(media),
            overview=media.get('overview'),
            release_date=valid_release_date(media),
            genres=genre_id_to_str(media),
            poster_path=media.get('poster_path')
        ).dict()
        for media in mixed_list
    ]


async def get_person_from_id(person_id: int):
    """ Gets data of a person from an id
    """
    tmdb_url = get_settings().tmdb_url
    tmdb_key = get_settings().tmdb_key

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
    tmdb_url = get_settings().tmdb_url
    tmdb_key = get_settings().tmdb_key

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
        runtime=get_movie_length(movies.get('runtime')),
        providers=get_providers(movies.get('watch/providers'), country_code),
        recommendations=get_recommendations(movies.get('recommendations')),
        poster_path=movies.get('poster_path'),
        backdrop_path=movies.get('backdrop_path'),
        cast=movies.get('credits').get('cast')
    )


def get_tv_from_id(tv_id: int, country_code: str = 'DK') -> TV:
    """ Gets data of a tv series from an id
    """
    tmdb_url = get_settings().tmdb_url
    tmdb_key = get_settings().tmdb_key

    # Here we make 3 api calls into 1 using the append_to_response header
    url = f'{tmdb_url}tv/{tv_id}?api_key={get_settings().tmdb_key}' \
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
        number_of_seasons=tv.get('number_of_seasons'),
        seasons=tv.get('seasons'),
        backdrop_path=tv.get('backdrop_path'),
        cast=tv.get('credits').get('cast')
    )


def get_providers(providers: Dict, country_code: str = 'all') -> List[Dict]:
    """ Gets list of provider data for a movie from a specified country code
    """

    try:
        if country_code == 'all':
            return [
                {country: provider}
                for country in providers.get('results')
                if providers.get('results').get(country).get('flatrate')
                for provider in providers.get('results').get(country).get('flatrate')
            ]

        return [
            provider
            for provider in providers.get('results').get(country_code).get('flatrate')
            if providers.get('results').get(country_code).get('flatrate')
        ]
    except (AttributeError, TypeError):
        # If no providers for given country code
        return []


def get_recommendations(recommendations: Dict) -> List[Dict]:
    """ Gets list of recommended movies for a movie
    """

    return [result for result in recommendations['results']]
