import gzip
import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Tuple

import httpx
import requests
from tqdm import tqdm

from app.api_helpers import get_providers
from app.config import get_settings
from app.models import TV, Genre, Movie, Person
from app.util import log

tmdb_url = get_settings().tmdb_url
tmdb_key = get_settings().tmdb_key


def fetch_jsongz_files():
    day = 0
    no_data = True

    while no_data:
        date = datetime.now() - timedelta(day)

        log.info(f"Downloading dumps: {date.date()}")

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
        person_url = (
            f"http://files.tmdb.org/p/exports/person_ids_{date.month:02d}_"
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
        person_path = (
            f"{directory}person_ids_{date.month:02d}"
            f"_{date.day:02d}_{date.year}.json.gz"
        )

        movie_response = requests.get(movie_url, stream=True)
        tv_response = requests.get(tv_url, stream=True)
        person_response = requests.get(person_url, stream=True)

        if (
            movie_response.status_code == 200
            and tv_response.status_code == 200
            and person_response.status_code == 200
        ):
            no_data = False
            # First we remove the old files
            if os.path.isdir(directory):
                for file in os.listdir(directory):
                    os.remove(os.path.join(directory, file))

            with open(movie_path, "wb") as f:
                f.write(movie_response.raw.read())
                log.info(
                    f"[{movie_path}] downloaded succesfully".replace(directory, "")
                )

            with open(tv_path, "wb") as f:
                f.write(tv_response.raw.read())
                log.info(f"[{tv_path}] downloaded succesfully".replace(directory, ""))

            with open(person_path, "wb") as f:
                f.write(person_response.raw.read())
                log.info(
                    f"[{person_path}] downloaded succesfully".replace(directory, "")
                )
        else:
            # if we have tried to get data for more than 30 days we give up
            if day >= 30:
                log.error("No downloads for 30 days - giving up")
                exit(1)

            log.warning("Downloads failed - trying 1 day earlier")
            day += 1


def fetch_media_ids(
    popularity: float | None = 1,
) -> Tuple[list[str], list[str], list[str]]:
    """Fetches jsongz file from TMDB with all the relevant tv/movies"""
    fetch_jsongz_files()

    directory = "../json.gz_dumps"
    movie_ids = []
    tv_ids = []
    person_ids = []

    for file in tqdm(os.listdir(directory), desc="Running through json.gz files"):
        with gzip.open(os.path.join(directory, file), "r") as f:
            decoded = map(json.loads, f)
            filtered = filter(
                lambda x: popularity < x["popularity"] and not x.get("adult"), decoded
            )

            if "movie" in file:
                movie_ids = list(map(lambda x: f"m{x['id']}", filtered))
            elif "tv" in file:
                tv_ids = list(map(lambda x: f"t{x['id']}", filtered))
            elif "person" in file:
                person_ids = list(map(lambda x: f"p{x['id']}", filtered))
            else:
                log.error('Filename doesn\'t start with "movie", "tv" or "person"')

    return movie_ids, tv_ids, person_ids


async def get_person_from_id(person_id: int):
    """Gets data of a person from an id"""
    # Here we make 3 api calls into 1 using the append_to_response header
    url = (
        f"{tmdb_url}person/{person_id}?api_key={tmdb_key}"
        "&append_to_response=movie_credits,tv_credits,external_ids"
    )

    async with httpx.AsyncClient(http2=True) as client:
        response = await client.get(url)
        person = response.json()

        # pydantic model for a person
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
            imdb_id=person.get("external_ids").get("imdb_id"),
        )


async def get_movie_from_id(movie_id: int, country_code: str = "DK") -> Movie:
    """Gets data of a movie from an id"""
    # Here we make 3 api calls into 1 using the append_to_response header
    url = (
        f"{tmdb_url}movie/{movie_id}?api_key={tmdb_key}"
        "&append_to_response=watch/providers,recommendations,credits"
    )

    async with httpx.AsyncClient(http2=True) as client:
        response = await client.get(url)
        movie = response.json()

        # pydantic model for a movie
        return Movie(
            id=movie.get("id"),
            title=movie.get("title"),
            release_date=movie.get("release_date"),
            overview=movie.get("overview"),
            genres=[
                Genre(label=genre.get("name"), value=genre.get("name"))
                for genre in movie.get("genres")
            ],
            imdb_id=movie.get("imdb_id"),
            runtime=movie.get("runtime"),
            flatrate_providers=get_providers(
                "flatrate", movie.get("watch/providers"), country_code
            ),
            free_providers=get_providers(
                "free", movie.get("watch/providers"), country_code
            ),
            recommendations=get_recommendations(movie.get("recommendations")),
            poster_path=movie.get("poster_path"),
            cast=movie.get("credits").get("cast"),
            popularity=movie.get("popularity"),
            backdrop_path=movie.get("backdrop_path"),
        )


async def get_tv_from_id(tv_id: int, country_code: str = "DK") -> TV:
    """Gets data of a tv series from an id"""
    # Here we make 3 api calls into 1 using the append_to_response header
    url = (
        f"{tmdb_url}tv/{tv_id}?api_key={tmdb_key}"
        "&append_to_response=watch/providers,recommendations,credits,external_ids"
    )

    async with httpx.AsyncClient(http2=True) as client:
        response = await client.get(url)
        tv = response.json()

        # pydantic model for a tv series
        return TV(
            id=tv.get("id"),
            name=tv.get("name"),
            first_air_date=tv.get("first_air_date"),
            overview=tv.get("overview"),
            genres=[
                Genre(label=genre.get("name"), value=genre.get("name"))
                for genre in tv.get("genres")
            ],
            episode_run_time=tv.get("episode_run_time"),
            flatrate_providers=get_providers(
                "flatrate", tv.get("watch/providers"), country_code
            ),
            free_providers=get_providers(
                "free", tv.get("watch/providers"), country_code
            ),
            recommendations=get_recommendations(tv.get("recommendations")),
            poster_path=tv.get("poster_path"),
            popularity=tv.get("popularity"),
            number_of_seasons=tv.get("number_of_seasons"),
            seasons=tv.get("seasons"),
            backdrop_path=tv.get("backdrop_path"),
            cast=tv.get("credits").get("cast"),
            imdb_id=tv.get("external_ids").get("imdb_id"),
        )


def fetch_genres() -> dict:
    """Gets genres from movies and tv-series to translate genre_ids"""
    movie_url = "https://api.themoviedb.org/3/genre/movie/list?" f"api_key={tmdb_key}"
    tv_url = "https://api.themoviedb.org/3/genre/tv/list?" f"api_key={tmdb_key}"

    movie_genres = requests.get(movie_url).json()
    tv_genres = requests.get(tv_url).json()

    movie_genre_dict = {genre["id"]: genre["name"] for genre in movie_genres["genres"]}
    tv_genre_dict = {genre["id"]: genre["name"] for genre in tv_genres["genres"]}

    # Only keeps the unique keys
    return {**movie_genre_dict, **tv_genre_dict}


def get_recommendations(recommendations: dict) -> list[dict] | None:
    """Gets list of recommended movies for a movie"""

    if recommendations.get("results"):
        return [result for result in recommendations["results"]]
