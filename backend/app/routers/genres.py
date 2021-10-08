from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from db.crud import get_all_genres


router = APIRouter(
    prefix="/genres",
    tags=["genres"],
    responses={404: {"description": "Genre(s) not found"}},
)


@router.get("/")
async def read_all_genres(db: Session = Depends(get_db)):
    """Reads all genres, returns only name and value"""
    db_genres = get_all_genres(db=db)
    return {genre.name: genre.value for genre in db_genres}
