from typing import Any

from pydantic import BaseModel


class Media(BaseModel):
    id: str
    title: str | None
    original_title: str
    overview: str | None
    release_date: str | None
    genres: Any | None  # Rapand told me to do it :'( #TODO: find a proper solution
    poster_path: str | None
    popularity: int | None
    providers: list[dict] | None
    specific_provider_names: list[str] | None
    specific_providers: list[dict] | None

    class Config:
        # Makes use of database syntax "media.id" instead of "media['id']
        orm_mode = True


class Movie(BaseModel):
    id: int
    title: str
    release_date: str
    overview: str
    genres: list[str] | None
    imdb_id: str | None
    runtime: str | None
    providers: list[dict] | None
    recommendations: list[dict]
    poster_path: str | None
    popularity: int
    backdrop_path: str | None
    cast: list[dict]


class TV(BaseModel):
    id: int
    name: str
    first_air_date: str | None
    overview: str
    genres: list[str] | None
    episode_run_time: list[int]
    providers: list[dict] | None
    recommendations: list[dict] | None
    poster_path: str | None
    popularity: int
    number_of_seasons: int
    seasons: list[dict]
    backdrop_path: str | None
    cast: list[dict]


class Person(BaseModel):
    id: int
    name: str
    birthdate: str | None
    deathday: str | None
    biography: str
    place_of_birth: str | None
    aslo_knows_as: str | None
    profile_path: str | None
    movie_credits: list[dict] | None
    tv_credits: list[dict] | None
    gender: int


class Genre(BaseModel):
    id: int
    name: str
    value: str

    class Config:
        orm_mode = True
