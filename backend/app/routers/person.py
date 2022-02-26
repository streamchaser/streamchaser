import json

from app.api import get_person_from_id
from app.db.cache import redis
from app.schemas import Person
from fastapi import APIRouter


router = APIRouter(
    prefix="/person",
    tags=["person"],
    responses={404: {"description": "Person not found"}},
)


@router.get("/{person_id}")
async def get_person(person_id: int) -> Person:
    """Specific TV page"""
    if cached_person := (await redis.get(f"person:{person_id}")):
        return json.loads(cached_person)
    person = await get_person_from_id(person_id)
    await redis.set(f"person:{person_id}", person.json())
    await redis.expire(f"person:{person_id}", 60 * 60 * 24)  # 1 day
    return person
