import json

from app.db.cache import redis
from fastapi import APIRouter


router = APIRouter(
    prefix="/providers",
    tags=["providers"],
    responses={404: {"description": "Provider(s) not found"}},
)


@router.get("/{country_code}")
async def read_all_providers(country_code):
    """Reads all the providers from providers.txt"""
    country_code = country_code.upper()

    if providers := await redis.get(f"{country_code}_providers"):
        return json.loads(providers)
