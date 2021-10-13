from fastapi import APIRouter

from backend.app.api import get_person_from_id
from backend.app.schemas import Person


router = APIRouter(
    prefix="/person",
    tags=["person"],
    responses={404: {"description": "Person not found"}},
)


@router.get("/{person_id}")
async def get_person(person_id: int) -> Person:
    """Specific TV page"""
    return await get_person_from_id(person_id)
