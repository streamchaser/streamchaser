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
    if free_providers := await redis.get(f"{country_code}_free_providers"):
        free_providers = json.loads(free_providers)

    if flatrate_providers := await redis.get(f"{country_code}_flatrate_providers"):
        flatrate_providers = json.loads(flatrate_providers)

    return [*flatrate_providers, *free_providers]
