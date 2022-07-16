from app.db.search import async_client
from fastapi import APIRouter
from fastapi.param_functions import Query


router = APIRouter(
    prefix="/media",
    tags=["media"],
    responses={404: {"description": "Media not found"}},
)


@router.get("")
async def lookup_ids(
    c: str = Query("DK", description="A country code"),
    ids: list[str] = Query(
        ["m101299", "m10377"], description="The list of IDs you want to lookup"
    ),
):
    """Takes a list of IDs and returns the matching list of Media from MeiliSearch"""

    country_code = c.upper()
    filter = [[f"id={id}" for id in ids]]

    return await async_client.index(f"media_{country_code}").search("*", filter=filter)
