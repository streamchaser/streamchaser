from pydantic import BaseModel
from datetime import datetime
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
