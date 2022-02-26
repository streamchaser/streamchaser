import json

from app.api import get_movie_from_id
from app.db.cache import redis
from app.schemas import Movie
from fastapi import APIRouter


router = APIRouter(
    prefix="/movie",
    tags=["movie"],
    responses={404: {"description": "Movie(s) not found"}},
)


@router.get("/{country_code}/{movie_id}")
async def get_movie(movie_id: int, country_code: str) -> Movie:
    """Specific Movie page"""
    if cached_movie := (await redis.get(f"movie:{country_code}_{movie_id}")):
        return json.loads(cached_movie)
    movie = await get_movie_from_id(movie_id, country_code.upper())
    await redis.set(f"movie:{country_code}_{movie_id}", movie.json())
    await redis.expire(f"movie:{country_code}_{movie_id}", 60 * 60 * 24)  # 1 day
    return movie
