from fastapi import APIRouter

from app.db.database import db_client
from app.db.queries.generated import (
    SelectCountryProvidersResult,
    select_country_providers,
)

router = APIRouter(
    prefix="/providers",
    tags=["providers"],
    responses={404: {"description": "Provider(s) not found"}},
)


@router.get("/{country_code}", response_model=SelectCountryProvidersResult)
async def _(country_code):
    """Reads all the providers from the selected country (sorted by display_priority)"""

    return await select_country_providers(db_client, country_code=country_code)
