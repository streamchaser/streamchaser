import jwt
from app.config import get_settings
from app.db.database import db_client
from app.db.queries.select_user_watch_list_async_edgeql import select_user_watch_list
from app.db.queries.select_user_watch_list_async_edgeql import (
    SelectUserWatchListResultWatchListItem,
)
from app.db.queries.update_user_watch_list_add_async_edgeql import (
    update_user_watch_list_add,
)
from app.db.queries.update_user_watch_list_add_async_edgeql import (
    UpdateUserWatchListAddResult,
)
from app.db.queries.update_user_watch_list_remove_async_edgeql import (
    update_user_watch_list_remove,
)
from app.db.queries.update_user_watch_list_remove_async_edgeql import (
    UpdateUserWatchListRemoveResult,
)
from app.models import DecodedJWT
from app.util import decode_jwt
from fastapi import APIRouter
from fastapi import Depends

router = APIRouter(
    prefix="/watch_list",
    tags=["user-lists"],
)


secret = "hest1234"


# TODO: Needs some sort of validation - Depends middleware is great for this
@router.get("", response_model=SelectUserWatchListResultWatchListItem)
async def _(auth: DecodedJWT = Depends(decode_jwt)):
    """Gets the user's watch list"""
    return await select_user_watch_list(db_client, email=auth.email)


@router.post("", response_model=UpdateUserWatchListAddResult)
async def _(auth: str, streamchaser_id: str):
    """Adds a media to user's watch list"""
    try:
        decoded = jwt.decode(auth, get_settings().auth_secret, algorithms=["HS256"])
    except Exception as e:
        return f"Decode error: {e}"

    await update_user_watch_list_add(
        db_client, email=decoded["email"], streamchaser_id=streamchaser_id
    )


# TODO: Needs some sort of validation - Depends middleware is great for this
@router.delete("", response_model=UpdateUserWatchListRemoveResult)
async def _(auth: str, streamchaser_id: str):
    """Deletes a media to user's watch list"""
    try:
        decoded = jwt.decode(auth, get_settings().auth_secret, algorithms=["HS256"])
    except Exception as e:
        return f"Decode error: {e}"

    return await update_user_watch_list_remove(
        db_client, email=decoded["email"], streamchaser_id=streamchaser_id
    )
