from fastapi import APIRouter

from app.db.database import db_client
from app.db.queries.generated import (
    SelectCountriesResult,
    select_countries,
    select_countries_with_providers,
)

router = APIRouter(
    prefix="/countries",
    tags=["country"],
    responses={404: {"description": "Countries not found"}},
)


@router.get("", response_model=SelectCountriesResult | None)
async def _(provider_filter=True):
    """Returns all countries from DB"""
    if provider_filter:
        return await select_countries_with_providers(db_client)

    return await select_countries(db_client)
