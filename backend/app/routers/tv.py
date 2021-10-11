from fastapi import APIRouter

from backend.app.api import get_tv_from_id
from backend.app.schemas import TV


router = APIRouter(
    prefix="/tv",
    tags=["tv"],
    responses={404: {"description": "TV-show(s) not found"}},
)


@router.get("/{country_code}/{tv_id}")
async def get_tv(tv_id: int, country_code: str) -> TV:
    """Specific TV page"""
    return get_tv_from_id(tv_id, country_code.upper())
