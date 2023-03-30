import json

from fastapi import APIRouter

from app.api import get_tv_from_id
from app.db.cache import redis
from app.models import TV

router = APIRouter(
    prefix="/tv",
    tags=["tv"],
    responses={404: {"description": "TV-show(s) not found"}},
)


@router.get("/{country_code}/{tv_id}", response_model=TV)
async def get_tv(tv_id: int, country_code: str) -> TV:
    """Specific TV page"""
    country_code = country_code.upper()

    if cached_tv := (await redis.get(f"tv:{country_code}_{tv_id}")):
        return json.loads(cached_tv)
    tv = await get_tv_from_id(tv_id, country_code.upper())
    await redis.set(f"tv:{country_code}_{tv_id}", tv.json())
    await redis.expire(f"tv:{country_code}_{tv_id}", 60 * 60 * 24)  # 1 day
    return tv
