from fastapi import APIRouter, Depends

from app.db.database import db_client
from app.db.queries.generated import (
    InsertUserResult,
    SelectCountryProvidersResult,
    SelectUserProvidersResult,
    select_country_providers,
    select_user_providers,
    update_user_provider_add,
    update_user_provider_remove,
)
from app.models import GoogleAuth
from app.util import decode_jwt

router = APIRouter(
    prefix="/providers",
    tags=["providers"],
    responses={404: {"description": "Provider(s) not found"}},
)


@router.get("/{country_code}", response_model=SelectCountryProvidersResult)
async def _(country_code):
    """Reads all the providers from the selected country (sorted by display_priority)"""

    return await select_country_providers(db_client, country_code=country_code)


@router.get("", response_model=SelectUserProvidersResult | None)
async def get_user_providers(auth: GoogleAuth = Depends(decode_jwt)):
    """Gets the user's custom lists"""

    return await select_user_providers(db_client, email=auth.email)


@router.post("", response_model=InsertUserResult | None)
async def add_user_provider(provider_id: int, auth: GoogleAuth = Depends(decode_jwt)):
    """Adds a provider to the user"""

    return await update_user_provider_add(
        db_client, email=auth.email, provider_id=provider_id
    )


@router.delete("", response_model=InsertUserResult | None)
async def remove_user_provider(
    provider_id: int, auth: GoogleAuth = Depends(decode_jwt)
):
    """Removes a provider from the user"""

    return await update_user_provider_remove(
        db_client, email=auth.email, provider_id=provider_id
    )
