from fastapi import APIRouter
from meilisearch_python_async.models.client import ClientStats

from app.db.search import async_client

router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)


@router.get("", response_model=ClientStats)
async def get_all_stats() -> ClientStats:
    """Specific Movie page"""
    return await async_client.get_all_stats()
