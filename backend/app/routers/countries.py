from app.db.database import db_client
from app.db.queries.generated import select_countries
from app.db.queries.generated import SelectCountriesResult
from fastapi import APIRouter


router = APIRouter(
    prefix="/countries",
    tags=["country"],
    responses={404: {"description": "Countries not found"}},
)


@router.get("", response_model=SelectCountriesResult)
async def _():
    """Returns all countries from DB"""
    return await select_countries(db_client)
