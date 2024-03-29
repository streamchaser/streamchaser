from fastapi import APIRouter

from app.db.database import db_client
from app.db.queries.generated import SelectGenresResult, select_genres

router = APIRouter(
    prefix="/genres",
    tags=["genres"],
    responses={404: {"description": "Genre(s) not found"}},
)


@router.get("", response_model=SelectGenresResult)
async def _():
    """Returns all genres from DB"""
    return await select_genres(db_client)
