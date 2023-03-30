from fastapi import APIRouter, Depends

from app.db.database import db_client
from app.db.queries.generated import InsertUserResult, insert_user
from app.models import GoogleAuth
from app.util import decode_jwt

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


@router.post("", response_model=InsertUserResult | None)
async def _(auth: GoogleAuth = Depends(decode_jwt)):
    """Inserts user into EdgeDB if it isn't already there"""

    return await insert_user(db_client, name=auth.name, email=auth.email)
