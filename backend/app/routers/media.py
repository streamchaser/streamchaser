from typing import List

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from schemas import Media
from sqlalchemy.orm import Session

from backend.app.db.crud import create_media
from backend.app.db.crud import get_all_media
from backend.app.db.crud import get_media_by_id
from backend.app.db.database import get_db


router = APIRouter(
    prefix="/media",
    tags=["media"],
    responses={404: {"description": "Media not found"}},
)


@router.get("/{media_id}", response_model=Media)
async def read_specific_media(media_id: str, db: Session = Depends(get_db)):
    """Reads all database media"""
    db_media = get_media_by_id(db=db, media_id=media_id)
    if db_media:
        return db_media
    raise HTTPException(status_code=404, detail="Media doesn't exist")


@router.get("/", response_model=List[Media])
async def read_all_media(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """Reads all database media"""
    return get_all_media(db=db, skip=skip, limit=limit)


@router.post("/", response_model=Media)
async def post_media(media: Media, db: Session = Depends(get_db)):
    """Creates a media to the database"""
    db_media = get_media_by_id(db=db, media_id=media.id)
    if db_media:
        raise HTTPException(status_code=400, detail="Media already exists")
    return create_media(db=db, media=media)
