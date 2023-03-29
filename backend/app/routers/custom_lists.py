import uuid

from app.db.database import db_client
from app.db.queries.generated import InsertUserResult
from app.db.queries.generated import select_user_custom_lists
from app.db.queries.generated import SelectUserCustomListsResult
from app.db.queries.generated import update_custom_list_add
from app.db.queries.generated import update_custom_list_remove
from app.db.queries.generated import update_user_custom_lists_add
from app.db.queries.generated import update_user_custom_lists_remove
from app.db.queries.generated import UpdateCustomListAddResult
from app.models import GoogleAuth
from app.util import decode_jwt
from fastapi import APIRouter
from fastapi import Depends

router = APIRouter(
    prefix="/custom_lists",
    tags=["user-lists"],
)


@router.get("", response_model=SelectUserCustomListsResult | None)
async def get_custom_lists(auth: GoogleAuth = Depends(decode_jwt)):
    """Gets the user's custom lists"""

    return await select_user_custom_lists(db_client, email=auth.email)


@router.post("", response_model=InsertUserResult | None)
async def post_custom_list(list_name: str, auth: GoogleAuth = Depends(decode_jwt)):
    """Creates a new custom list for the user"""

    return await update_user_custom_lists_add(
        db_client, email=auth.email, list_name=list_name
    )


@router.delete("", response_model=InsertUserResult | None)
async def delete_custom_list(id: uuid.UUID, auth: GoogleAuth = Depends(decode_jwt)):
    """Removes the custom list"""

    return await update_user_custom_lists_remove(db_client, email=auth.email, id=id)


@router.post("{streamchaser_id}", response_model=UpdateCustomListAddResult | None)
async def post_media_to_custom_list(
    list_id: uuid.UUID, streamchaser_id: str, _: GoogleAuth = Depends(decode_jwt)
):
    """Adds a movie/tv/person to the custom list"""

    return await update_custom_list_add(
        db_client, streamchaser_id=streamchaser_id, id=list_id
    )


@router.delete("{streamchaser_id}", response_model=UpdateCustomListAddResult | None)
async def delete_media_from_custom_list(
    list_id: uuid.UUID, streamchaser_id: str, _: GoogleAuth = Depends(decode_jwt)
):
    """Removes a movie/tv/person from the custom list"""

    return await update_custom_list_remove(
        db_client, streamchaser_id=streamchaser_id, id=list_id
    )
