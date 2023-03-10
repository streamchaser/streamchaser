from app.db.database import db_client
from app.db.queries.get_genres_async_edgeql import get_genres
from app.db.queries.get_genres_async_edgeql import GetGenresResult
from fastapi import APIRouter


router = APIRouter(
    prefix="/genres",
    tags=["genres"],
    responses={404: {"description": "Genre(s) not found"}},
)


@router.get("", response_model=GetGenresResult)
async def _():
    """Returns all genres from DB"""
    return await get_genres(db_client)
