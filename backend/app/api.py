import os
from datetime import datetime
from datetime import timedelta
from pathlib import Path
from typing import Generator

import requests
from app.api_helpers import get_providers
from app.api_helpers import valid_original_title
from app.api_helpers import valid_release_date
from app.api_helpers import valid_title
from app.config import get_settings
from app.db import models
from app.schemas import Media
from app.schemas import Movie
from app.schemas import Person
from app.schemas import TV


tmdb_url = get_settings().tmdb_url
tmdb_key = get_settings().tmdb_key


def fetch_jsongz_files():
    day = 0
    no_data = True

    while no_data:
        date = datetime.now() - timedelta(day)

        print(f"Downloading dumps: {date.date()}")

        directory = "../json.gz_dumps/"
        Path(directory).mkdir(exist_ok=True)

        tv_url = (
            f"http://files.tmdb.org/p/exports/tv_series_ids_{date.month:02d}"
            f"_{date.day:02d}_{date.year}.json.gz"
        )
        movie_url = (
            f"http://files.tmdb.org/p/exports/movie_ids_{date.month:02d}_"
            f"{date.day:02d}_{date.year}.json.gz"
        )

        movie_path = (
            f"{directory}movie_ids_{date.month:02d}"
            f"_{date.day:02d}_{date.year}.json.gz"
        )
        tv_path = (
            f"{directory}tv_series_ids_{date.month:02d}"
            f"_{date.day:02d}_{date.year}.json.gz"
        )

        movie_response = requests.get(movie_url, stream=True)
        tv_response = requests.get(tv_url, stream=True)

        if movie_response.status_code == 200 and tv_response.status_code == 200:
            no_data = False
            # First we remove the old files
            if os.path.isdir(directory):
                for file in os.listdir(directory):
                    os.remove(os.path.join(directory, file))

            with open(movie_path, "wb") as f:
                f.write(movie_response.raw.read())
                print(f"[{movie_path}] downloaded succesfully".replace(directory, ""))

            with open(tv_path, "wb") as f:
                f.write(tv_response.raw.read())
                print(f"[{tv_path}] downloaded succesfully".replace(directory, ""))
        else:
            # if we have tried to get data for more than 30 days we give up
            if day >= 30:
                print("No downloads for 30 days - giving up")
                exit(1)

            print("Downloads failed - trying 1 day earlier")
            day += 1


def fetch_trending_movies(page: int) -> dict:
    url = f"{tmdb_url}trending/movie/week?api_key={tmdb_key}&page={page}"
    return requests.get(url).json()["results"]


def fetch_trending_tv(page: int) -> dict:
    url = f"{tmdb_url}trending/tv/week?api_key={tmdb_key}&page={page}"
    return requests.get(url).json()["results"]


def media_converter(mixed_list: list[dict]) -> Generator[Media, None, None]:
    """Takes a list movie/tv json ["results"] and converts it to Media"""

    return (
        # pydantic Media schema
        Media(
            id=media.get("id"),
            title=valid_title(media),
            original_title=valid_original_title(media),
            overview=media.get("overview"),
            release_date=valid_release_date(media),
            genres=[],
            poster_path=media.get("poster_path"),
            popularity=media.get("popularity"),
        ).dict()
        for media in mixed_list
    )


async def get_person_from_id(person_id: int):
    """Gets data of a person from an id"""
    # Here we make 3 api calls into 1 using the append_to_response header
    url = (
        f"{tmdb_url}person/{person_id}?api_key={tmdb_key}"
        "&append_to_response=movie_credits,tv_credits"
    )

    person = requests.get(url).json()

    # pydantic schema for a person
    return Person(
        id=person.get("id"),
        name=person.get("name"),
        birthdate=person.get("birthdate"),
        deathday=person.get("deathday"),
        biography=person.get("biography"),
        place_of_birth=person.get("place_of_birth"),
        also_known_as=person.get("also_known_as"),
        profile_path=person.get("profile_path"),
        gender=person.get("gender"),
        movie_credits=person.get("movie_credits").get("cast"),
        tv_credits=person.get("tv_credits").get("cast"),
    )


def get_movie_from_id(movie_id: int, country_code: str = "DK") -> Movie:
    """Gets data of a movie from an id"""
    # Here we make 3 api calls into 1 using the append_to_response header
    url = (
        f"{tmdb_url}movie/{movie_id}?api_key={tmdb_key}"
        "&append_to_response=watch/providers,recommendations,credits"
    )

    movies = requests.get(url).json()

    # pydantic schema for a movie
    return Movie(
        id=movies.get("id"),
        title=movies.get("title"),
        release_date=movies.get("release_date"),
        overview=movies.get("overview"),
        genres=[genre.get("name") for genre in movies.get("genres")],
        imdb_id=movies.get("imdb_id"),
        runtime=movies.get("runtime"),
        providers=get_providers(movies.get("watch/providers"), country_code),
        recommendations=get_recommendations(movies.get("recommendations")),
        poster_path=movies.get("poster_path"),
        cast=movies.get("credits").get("cast"),
        popularity=movies.get("popularity"),
        backdrop_path=movies.get("backdrop_path"),
    )


def get_tv_from_id(tv_id: int, country_code: str = "DK") -> TV:
    """Gets data of a tv series from an id"""
    # Here we make 3 api calls into 1 using the append_to_response header
    url = (
        f"{tmdb_url}tv/{tv_id}?api_key={tmdb_key}"
        "&append_to_response=watch/providers,recommendations,credits"
    )

    tv = requests.get(url).json()

    # pydantic schema for a tv series
    return TV(
        id=tv.get("id"),
        name=tv.get("name"),
        first_air_date=tv.get("first_air_date"),
        overview=tv.get("overview"),
        genres=[genre.get("name") for genre in tv.get("genres")],
        episode_run_time=tv.get("episode_run_time"),
        providers=get_providers(tv.get("watch/providers"), country_code),
        recommendations=get_recommendations(tv.get("recommendations")),
        poster_path=tv.get("poster_path"),
        popularity=tv.get("popularity"),
        number_of_seasons=tv.get("number_of_seasons"),
        seasons=tv.get("seasons"),
        backdrop_path=tv.get("backdrop_path"),
        cast=tv.get("credits").get("cast"),
    )


def get_genres() -> dict:
    """Gets genres from movies and tv-series to translate genre_ids"""
    movie_url = "https://api.themoviedb.org/3/genre/movie/list?" f"api_key={tmdb_key}"
    tv_url = "https://api.themoviedb.org/3/genre/tv/list?" f"api_key={tmdb_key}"

    movie_genres = requests.get(movie_url).json()
    tv_genres = requests.get(tv_url).json()

    movie_genre_dict = {genre["id"]: genre["name"] for genre in movie_genres["genres"]}
    tv_genre_dict = {genre["id"]: genre["name"] for genre in tv_genres["genres"]}

    # Only keeps the unique keys
    return {**movie_genre_dict, **tv_genre_dict}


def request_data(media: models.Media):
    title = ""

    try:
        if media.id[0] == "m":
            url = (
                f"{tmdb_url}movie/{media.id[1:]}?api_key={tmdb_key}"
                "&append_to_response=watch/providers"
            )
            title = "title"

        elif media.id[0] == "t":
            url = (
                f"{tmdb_url}tv/{media.id[1:]}?api_key={tmdb_key}"
                "&append_to_response=watch/providers"
            )
            title = "name"

        data = requests.get(url).json()

        return {
            "media_id": media.id,
            "title": data.get(title),
            "poster_path": data.get("poster_path"),
            "popularity": data.get("popularity"),
            "providers": get_providers(data.get("watch/providers")),
            "genres": [genre.get("name") for genre in data.get("genres")]
            if data.get("genres")
            else ["Unknown"],
        }

    except Exception as e:
        print(e)


def get_recommendations(recommendations: dict) -> list[dict]:
    """Gets list of recommended movies for a movie"""

    return [result for result in recommendations["results"]]
