import jwt
from app.config import get_settings
from app.db.database import db_client
from app.db.queries.insert_user_async_edgeql import insert_user
from app.db.queries.insert_user_async_edgeql import InsertUserResult
from fastapi import APIRouter


router = APIRouter(
    prefix="/user",
    tags=["user"],
)


# TODO: Needs some sort of validation - Depends middleware is great for this
@router.post("", response_model=InsertUserResult)
async def _(auth: str):
    """Inserts user into EdgeDB"""
    try:
        decoded = jwt.decode(auth, get_settings().auth_secret, algorithms=["HS256"])
    except Exception as e:
        return f"Decode error: {e}"

    return await insert_user(db_client, name=decoded["name"], email=decoded["email"])
