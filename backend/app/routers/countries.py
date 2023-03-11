from app.db.database import db_client
from app.db.queries.get_countries_async_edgeql import get_countries
from app.db.queries.get_countries_async_edgeql import GetCountriesResult
from fastapi import APIRouter


router = APIRouter(
    prefix="/countries",
    tags=["country"],
    responses={404: {"description": "Countries not found"}},
)


@router.get("", response_model=GetCountriesResult)
async def _():
    """Returns all countries from DB"""
    return await get_countries(db_client)
