from helpers import *
from models import *


def get_trending_movies(media_type: str = 'all',
                        time_window: str = 'week',
                        page: int = 1) -> dict[any]:
    """
    :param media_type: 'all', 'movie', 'tv', 'person'
    :param time_window: 'week', 'day'
    :param page: int 1:many
    """
    url = f'https://api.themoviedb.org/3/trending/{media_type}/{time_window}?api_key={TMDB_KEY}&page={page}'
    return requests.get(url).json()


def get_all_movies(total_pages: int = 25) -> list:
    """ Gets all movies from the specified number of pages
    """
    page_num = 1
    movie_list = []

    while page_num < total_pages:
        movie_dict = get_trending_movies('movie', 'week', page_num)
        tv_dict = get_trending_movies('tv', 'week', page_num)

        for page in movie_dict['results']:
            movie_list.append(page)

        for page in tv_dict['results']:
            movie_list.append(page)

        page_num += 1

    return movie_list


def get_movie_from_id(movie_id: int, country_code: str) -> Movie:
    """ Gets data of a movie from an id
    """

    # Here we make 3 api calls into 1 using the append_to_response header we get provers, recommendations & watch
    search_api_url = f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={TMDB_KEY}&append_to_response=watch/providers,recommendations'

    data = requests.get(search_api_url).json()

    # pydantic model for a movie
    movie = Movie(
        id=data.get('id'),
        title=data.get('title'),
        release_date=data.get('release_date'),
        overview=data.get('overview'),
        genres=[
            genre.get('name') for genre in data.get('genres')
        ],
        imdb_id=data.get('imdb_id'),
        runtime=get_movie_length(data.get('runtime')),
        providers=get_providers(data.get('watch/providers'), country_code),
        recommendations=get_recommendations(data.get('recommendations')),
        poster_path=data.get('poster_path')
    )

    return movie


def get_tv_from_id(tv_id: int, country_code: str) -> TV:
    """ Gets data of a tv series from an id
    """

    search_api_url = f'https://api.themoviedb.org/3/tv/{tv_id}?api_key={TMDB_KEY}&append_to_response=watch/providers,recommendations'

    data = requests.get(search_api_url).json()

    # pydantic model for a tv series
    tv = TV(
        id=data.get('id'),
        name=data.get('name'),
        first_air_date=data.get('first_air_date'),
        overview=data.get('overview'),
        genres=[
            genre.get('name') for genre in data.get('genres')
        ],
        episode_run_time=data.get('episode_run_time'),
        providers=get_providers(data.get('watch/providers'), country_code),
        recommendations=get_recommendations(data.get('recommendations')),
        poster_path=data.get('poster_path'),
        number_of_seasons=data.get('number_of_seasons')
    )

    return tv


def get_providers(providers: dict, country_code: str) -> list[dict]:
    """ Gets list of provider data for a movie from a specified country code
    """
    provider_list = []

    # Filters providers from the provided country code
    if country_code in providers['results']:
        # We check if there are any flatrate elements
        if 'flatrate' in providers['results'][country_code]:
            # Add the elements to our provider list
            for element in providers['results'][country_code]['flatrate']:
                temp_dict = {
                    'id': element['provider_id'],
                    'name': element['provider_name'],
                    'logo_path': element['logo_path']
                }
                provider_list.append(temp_dict)

    return provider_list


def get_recommendations(recommendations: dict) -> list[dict]:
    """ Gets list of recommended movies for a movie
    """

    return [result for result in recommendations['results']]
