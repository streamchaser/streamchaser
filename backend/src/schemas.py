from typing import Optional

from pydantic import BaseModel


class Media(BaseModel):
    id: str
    title: str
    original_title: str
    overview: str
    release_date: str
    genres: Optional[list[str]]
    poster_path: Optional[str]
    providers: Optional[list[dict]]
    specific_provider_names: Optional[list[str]]
    specific_providers: Optional[list[dict]]

    class Config:
        # Makes use of database syntax "media.id" instead of "media['id']
        orm_mode = True


class Movie(BaseModel):
    id: int
    title: str
    release_date: str
    genres: Optional[list[str]]
    imdb_id: str
    runtime: str
    providers: Optional[list[dict]]
    recommendations: list[dict]
    poster_path: Optional[str]


class TV(BaseModel):
    id: int
    name: str
    first_air_date: Optional[str]
    overview: str
    genres: Optional[list[str]]
    episode_run_time: list[int]
    providers: Optional[list[dict]]
    recommendations: Optional[list[dict]]
    poster_path: Optional[str]
    number_of_seasons: int


class Genre(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True
