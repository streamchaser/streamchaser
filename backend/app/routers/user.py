from fastapi import APIRouter, Depends

from app.db.database import db_client
from app.db.queries.generated import (
    InsertUserResult,
    SelectUserResult,
    insert_user,
    select_user,
)
from app.models import GoogleAuth
from app.util import decode_jwt

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


@router.get("", response_model=SelectUserResult | None)
async def get_user(auth: GoogleAuth = Depends(decode_jwt)):
    """Gets user data matching the email"""

    return await select_user(db_client, email=auth.email)


@router.post("", response_model=InsertUserResult | None)
async def post_user(auth: GoogleAuth = Depends(decode_jwt)):
    """Inserts user into EdgeDB if it isn't already there"""

    return await insert_user(db_client, name=auth.name, email=auth.email)
