from typing import Dict, List

import requests

from api_helpers import (API_URL, TMDB_KEY, genre_id_to_str, get_movie_length,
                         unique_id, valid_original_title, valid_release_date,
                         valid_title)
from schemas import TV, Media, Movie


def fetch_trending_movies(page: int) -> Dict:
    url = f'{API_URL}trending/movie/week?api_key={TMDB_KEY}&page={page}'
    return requests.get(url).json()["results"]


def fetch_trending_tv(page: int) -> Dict:
    url = f'{API_URL}trending/tv/week?api_key={TMDB_KEY}&page={page}'
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


def get_movie_from_id(movie_id: int, country_code: str = 'DK') -> Movie:
    """ Gets data of a movie from an id
    """

    # Here we make 3 api calls into 1 using the append_to_response header
    search_api_url = f'{API_URL}movie/{movie_id}?api_key={TMDB_KEY}' \
                     f'&append_to_response=watch/providers,recommendations,credits'

    movies = requests.get(search_api_url).json()

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
        cast=get_cast(movies.get('credits'))
    )


def get_tv_from_id(tv_id: int, country_code: str = 'DK') -> TV:
    """ Gets data of a tv series from an id
    """

    # Here we make 3 api calls into 1 using the append_to_response header
    search_api_url = f'{API_URL}tv/{tv_id}?api_key={TMDB_KEY}' \
                     f'&append_to_response=watch/providers,recommendations,credits'

    tv = requests.get(search_api_url).json()

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
        cast=get_cast(tv.get('credits'))
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


def get_cast(credits: Dict) -> List[Dict]:
    """ Gets list of cast members for a movie
    """

    return [result for result in credits['cast']]
