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
from app.models import GoogleAuth
from app.util import decode_jwt
from fastapi import APIRouter
from fastapi import Depends

router = APIRouter(
    prefix="/watch_list",
    tags=["user-lists"],
)


@router.get("", response_model=SelectUserWatchListResultWatchListItem)
async def _(auth: GoogleAuth = Depends(decode_jwt)):
    """Gets the user's watch list"""

    return await select_user_watch_list(db_client, email=auth.email)


@router.post("", response_model=UpdateUserWatchListAddResult)
async def _(streamchaser_id: str, auth: GoogleAuth = Depends(decode_jwt)):
    """Adds a media to user's watch list"""

    return await update_user_watch_list_add(
        db_client, email=auth.email, streamchaser_id=streamchaser_id
    )


@router.delete("", response_model=UpdateUserWatchListRemoveResult)
async def _(streamchaser_id: str, auth: GoogleAuth = Depends(decode_jwt)):
    """Deletes a media to user's watch list"""

    return await update_user_watch_list_remove(
        db_client, email=auth.email, streamchaser_id=streamchaser_id
    )
