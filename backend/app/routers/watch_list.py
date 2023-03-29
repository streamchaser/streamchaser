from fastapi import APIRouter, Depends

from app.db.database import db_client
from app.db.queries.generated import (
    InsertUserResult,
    SelectUserWatchListResult,
    select_user_watch_list,
    update_user_watch_list_add,
    update_user_watch_list_remove,
)
from app.models import GoogleAuth
from app.util import decode_jwt

router = APIRouter(
    prefix="/watch_list",
    tags=["user-lists"],
)


@router.get("", response_model=SelectUserWatchListResult | None)
async def _(auth: GoogleAuth = Depends(decode_jwt)):
    """Gets the user's watch list"""

    return await select_user_watch_list(db_client, email=auth.email)


@router.post("", response_model=InsertUserResult | None)
async def _(streamchaser_id: str, auth: GoogleAuth = Depends(decode_jwt)):
    """Adds a media to the user's watch list"""

    return await update_user_watch_list_add(
        db_client, email=auth.email, streamchaser_id=streamchaser_id
    )


@router.delete("", response_model=InsertUserResult | None)
async def _(streamchaser_id: str, auth: GoogleAuth = Depends(decode_jwt)):
    """Deletes a media from the user's watch list"""

    return await update_user_watch_list_remove(
        db_client, email=auth.email, streamchaser_id=streamchaser_id
    )
