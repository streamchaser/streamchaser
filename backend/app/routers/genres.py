from app.db.crud import get_all_genres
from app.db.database import get_db
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session


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
