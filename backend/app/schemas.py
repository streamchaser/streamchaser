from typing import Dict, List, Optional, Any

from pydantic import BaseModel


class Media(BaseModel):
    id: str
    title: str
    original_title: str
    overview: str
    release_date: str
    genres: Optional[Any]  # Rapand told me to do it :'( #TODO: find a proper solution
    poster_path: Optional[str]
    popularity: Optional[int]
    providers: Optional[List[Dict]]
    specific_provider_names: Optional[List[str]]
    specific_providers: Optional[List[Dict]]

    class Config:
        # Makes use of database syntax "media.id" instead of "media['id']
        orm_mode = True


class Movie(BaseModel):
    id: int
    title: str
    release_date: str
    overview: str
    genres: Optional[List[str]]
    imdb_id: Optional[str]
    runtime: str
    providers: Optional[List[Dict]]
    recommendations: List[Dict]
    poster_path: Optional[str]
    popularity: int
    backdrop_path: Optional[str]
    cast: List[Dict]


class TV(BaseModel):
    id: int
    name: str
    first_air_date: Optional[str]
    overview: str
    genres: Optional[List[str]]
    episode_run_time: List[int]
    providers: Optional[List[Dict]]
    recommendations: Optional[List[Dict]]
    poster_path: Optional[str]
    popularity: int
    number_of_seasons: int
    seasons: List[Dict]
    backdrop_path: Optional[str]
    cast: List[Dict]


class Person(BaseModel):
    id: int
    name: str
    birthdate: Optional[str]
    deathday: Optional[str]
    biography: str
    place_of_birth: Optional[str]
    aslo_knows_as: Optional[str]
    profile_path: Optional[str]
    movie_credits: Optional[List[Dict]]
    tv_credits: Optional[List[Dict]]
    gender: int


class Genre(BaseModel):
    id: int
    name: str
    value: str

    class Config:
        orm_mode = True
