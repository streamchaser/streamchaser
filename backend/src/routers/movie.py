from fastapi import APIRouter

from api import get_movie_from_id
from schemas import Movie


router = APIRouter(
    prefix="/movie",
    tags=["movie"],
    responses={404: {"description": "Movie(s) not found"}},
)


@router.get("/{country_code}/{movie_id}")
async def get_movie(movie_id: int, country_code: str) -> Movie:
    """Specific Movie page"""
    return get_movie_from_id(movie_id, country_code.upper())
