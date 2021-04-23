from pydantic import BaseModel
from typing import Optional


class Movie(BaseModel):
    id: int
    title: str
    release_date: str
    genres: Optional[list[str]] = None
    imdb_id: str
    runtime: str
    providers: Optional[list[dict]] = None
    recommendations: list[dict] 
    poster_path: Optional[str] = None


class TV(BaseModel):
    id: int
    name: str
    first_air_date: Optional[str] = None
    overview: str
    genres: Optional[list[str]] = None
    episode_run_time: list[int]
    providers: Optional[list[dict]] = None
    recommendations: Optional[list[dict]] = None
    poster_path: Optional[str] = None
    number_of_seasons: int
