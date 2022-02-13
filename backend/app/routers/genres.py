from app.db.cache import Genre
from fastapi import APIRouter


router = APIRouter(
    prefix="/genres",
    tags=["genres"],
    responses={404: {"description": "Genre(s) not found"}},
)


@router.get("/", response_model=list[Genre])
async def read_all_genres():
    """Reads all genres, returns only name and value"""
    return await Genre.select()
