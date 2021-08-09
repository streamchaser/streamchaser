import requests
from tqdm import trange
from schemas import Media, Movie, TV
from api_helpers import unique_id, valid_title, valid_original_title, valid_release_date, \
    genre_id_to_str, get_movie_length, TMDB_KEY

API_URL = 'https://api.themoviedb.org/3/'


def request_trending_media(media_type: str = 'all',
                           time_window: str = 'week',
                           page: int = 1) -> dict[any]:
    """
    :param media_type: 'all', 'movie', 'tv', 'person'
    :param time_window: 'week', 'day'
    :param page: int 1:many
    """
    url = f'{API_URL}trending/{media_type}/{time_window}?api_key={TMDB_KEY}&page={page}'
    return requests.get(url).json()


def get_trending_media_by_total_pages(total_pages: int = 25) -> list:
    """ Gets all movies and tv-series from the specified number of pages
    """
    media_list = []

    for page_num in trange(1, total_pages + 1, desc='Fetching media from TMDb'):
        movie_dict = request_trending_media('movie', 'week', page_num)
        tv_dict = request_trending_media('tv', 'week', page_num)

        for page in movie_dict['results']:
            media_list.append(page)

        for page in tv_dict['results']:
            media_list.append(page)

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
        for media in media_list
    ]


def get_movie_from_id(movie_id: int, country_code: str = 'DK') -> Movie:
    """ Gets data of a movie from an id
    """

    # Here we make 3 api calls into 1 using the append_to_response header
    search_api_url = f'{API_URL}movie/{movie_id}?api_key={TMDB_KEY}' \
                     f'&append_to_response=watch/providers,recommendations'

    movies = requests.get(search_api_url).json()

    # pydantic schema for a movie
    movie_schema = Movie(
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
        backdrop_path=movies.get('backdrop_path')
    )

    return movie_schema


def get_tv_from_id(tv_id: int, country_code: str = 'DK') -> TV:
    """ Gets data of a tv series from an id
    """

    # Here we make 3 api calls into 1 using the append_to_response header
    search_api_url = f'{API_URL}tv/{tv_id}?api_key={TMDB_KEY}' \
                     f'&append_to_response=watch/providers,recommendations'

    tv = requests.get(search_api_url).json()

    # pydantic schema for a tv series
    tv_schema = TV(
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
        backdrop_path=tv.get('backdrop_path')
    )

    return tv_schema


def get_providers(providers: dict, country_code: str = 'all') -> list[dict]:
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


def get_recommendations(recommendations: dict) -> list[dict]:
    """ Gets list of recommended movies for a movie
    """

    return [result for result in recommendations['results']]
