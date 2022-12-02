from app.db.search import async_client
from app.models import Meilisearch
from fastapi import APIRouter
from fastapi.param_functions import Query


router = APIRouter(
    prefix="/media",
    tags=["media"],
    responses={404: {"description": "Media not found"}},
)


@router.get("", response_model=Meilisearch)
async def lookup_ids(
    c: str = Query("DK", description="A country code"),
    limit: int = Query(
        20, description="Control the maximum amount of shown search results"
    ),
    ids: list[str] = Query(
        ["m101299", "m10377"], description="The list of IDs you want to lookup"
    ),
) -> Meilisearch:
    """Takes a list of IDs and returns the matching list of Media from MeiliSearch"""

    country_code = c.upper()
    filter = [[f"id={id}" for id in ids]]

    return await async_client.index("media").search(
        "*",
        filter=filter,
        limit=limit,
        attributes_to_retrieve=[
            f"providers.results.{country_code}",
            "title",
            "poster_path",
            "id",
        ],
    )
