from app.db.search import async_client
from fastapi import APIRouter
from fastapi import Query


router = APIRouter(
    prefix="/search",
    tags=["search"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{user_input}")
async def search(
    user_input: str,
    limit: int = 20,
    c: str = "DK",
    g: list[str] | None = Query(None),
    p: list[str] | None = Query(None),
):
    """
    # Our endpoint for the MeiliSearch API
    * **user_input**: Input to lookup media
    * **limit**: Amount of results to return
    * **c**: Country code(defaulting to Denmark)
    * **g**: Optional genre query
    * **p**: Optional provider query
    """
    genres = g
    providers = p
    country_code = c.upper()

    if genres and providers:
        genre_list: list[str] = [f'genres="{genre}"' for genre in genres]
        provider_list: list[list[str]] = [
            [f'provider_names="{providers}"' for providers in providers]
        ]
        return await async_client.index(f"media_{country_code}").search(
            user_input,
            limit=limit,
            sort=["popularity:desc"],
            # This is a mix of AND and OR logic
            filter=genre_list + provider_list,
        )
    if genres:
        return await async_client.index(f"media_{country_code}").search(
            user_input,
            limit=limit,
            sort=["popularity:desc"],
            # This is using AND logic
            filter=[f'genres="{genre}"' for genre in genres],
        )
    if providers:
        return await async_client.index(f"media_{country_code}").search(
            user_input,
            limit=limit,
            sort=["popularity:desc"],
            # This is using OR logic
            filter=[[f'provider_names="{providers}"' for providers in providers]],
        )
    return await async_client.index(f"media_{country_code}").search(
        user_input, limit=limit, sort=["popularity:desc"]
    )
