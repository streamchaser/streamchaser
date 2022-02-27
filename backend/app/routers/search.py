from app.db.search import client
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
    limit: int,
    c: str,
    g: list[str] | None = Query(None),
    p: list[str] | None = Query(None),
):
    """
    # Our endpoint for the MeiliSearch API
    * **user_input**: Input to lookup media
    * **limit**: Amount of results to return
    * **g**: Optional genre query
    * **p**: Optional provider query
    """
    genres = g
    providers = p
    country_code = c

    if genres and providers:
        genre_list: list[str] = [f'genres="{genre}"' for genre in genres]
        provider_list: list[list[str]] = [
            [f'provider_names="{providers}"' for providers in providers]
        ]

        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": limit,
                "filter": genre_list + provider_list,
                "sort": ["popularity:desc"],
            },
        )
    if genres:
        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": limit,
                # This is using AND logic
                "filter": [f'genres="{genre}"' for genre in genres],
                "sort": ["popularity:desc"],
            },
        )
    if providers:
        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": limit,
                # This is using OR logic
                "filter": [
                    [f'provider_names="{providers}"' for providers in providers]
                ],
                "sort": ["popularity:desc"],
            },
        )
    return client.index(f"media_{country_code}").search(
        user_input, {"limit": limit, "sort": ["popularity:desc"]}
    )
