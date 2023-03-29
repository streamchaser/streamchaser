from app.db.database import db_client
from app.db.queries.generated import InsertUserResult
from app.db.queries.generated import select_user_favorites
from app.db.queries.generated import SelectUserFavoritesResult
from app.db.queries.generated import update_user_favorites_add
from app.db.queries.generated import update_user_favorites_remove
from app.models import GoogleAuth
from app.util import decode_jwt
from fastapi import APIRouter
from fastapi import Depends

router = APIRouter(
    prefix="/favorites",
    tags=["user-lists"],
)


@router.get("", response_model=SelectUserFavoritesResult | None)
async def _(auth: GoogleAuth = Depends(decode_jwt)):
    """Gets the user's favorites"""

    return await select_user_favorites(db_client, email=auth.email)


@router.post("", response_model=InsertUserResult | None)
async def _(streamchaser_id: str, auth: GoogleAuth = Depends(decode_jwt)):
    """Adds a media to user's favorites"""

    return await update_user_favorites_add(
        db_client, email=auth.email, streamchaser_id=streamchaser_id
    )


@router.delete("", response_model=InsertUserResult | None)
async def _(streamchaser_id: str, auth: GoogleAuth = Depends(decode_jwt)):
    """Deletes a media from the user's favorites"""

    return await update_user_favorites_remove(
        db_client, email=auth.email, streamchaser_id=streamchaser_id
    )
