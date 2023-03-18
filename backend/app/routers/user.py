from app.db.database import db_client
from app.db.queries.insert_user_async_edgeql import insert_user
from app.db.queries.insert_user_async_edgeql import InsertUserResult
from app.models import GoogleAuth
from app.util import decode_jwt
from fastapi import APIRouter
from fastapi import Depends


router = APIRouter(
    prefix="/user",
    tags=["user"],
)


@router.post("", response_model=InsertUserResult)
async def _(auth: GoogleAuth = Depends(decode_jwt)):
    """Inserts user into EdgeDB if it isn't already there"""

    return await insert_user(db_client, name=auth.name, email=auth.email)
