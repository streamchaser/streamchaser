from fastapi import APIRouter

from api import get_person_from_id
from schemas import Person


router = APIRouter(
    prefix="/person",
    tags=["person"],
    responses={404: {"description": "Person not found"}},
)


@router.get("/{person_id}")
async def get_person(person_id: int) -> Person:
    """Specific TV page"""
    return get_person_from_id(person_id)
