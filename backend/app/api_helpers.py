from typing import Dict, List

from config import get_settings


tmdb_key = get_settings().tmdb_key


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
