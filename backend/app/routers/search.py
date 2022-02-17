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
    frp: list[str] = Query(None),
    flp: list[str] = Query(None),
):
    """
    # Our endpoint for the MeiliSearch API
    * **user_input**: Input to lookup media
    * **limit**: Amount of results to return
    * **g**: Optional genre query
    * **p**: Optional provider query
    """
    genres = g
    free_providers = frp
    flatrate_providers = flp
    country_code = c

    if genres and (frp or flp):
        genre_list: list[str] = [f'genres="{genre}"' for genre in genres]
        flatrate_provider_list: list[list[str]] = [
            [
                f'flatrate_provider_names="{providers}"'
                for providers in flatrate_providers
            ]
        ]

        free_provider_list: list[list[str]] = [
            [f'free_provider_names="{providers}"' for providers in free_providers]
        ]

        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": limit,
                "filter": genre_list + flatrate_provider_list + free_provider_list,
                "sort": ["popularity:desc"],
            },
        )
    elif genres:
        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": limit,
                # This is using AND logic
                "filter": [f'genres="{genre}"' for genre in genres],
                "sort": ["popularity:desc"],
            },
        )
    elif frp or flp:
        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": limit,
                # This is using OR logic
                "filter": [
                    [
                        f'flatrate_provider_names="{providers}"'
                        for providers in flatrate_providers
                    ]
                    + [
                        f'free_provider_names="{providers}"'
                        for providers in free_providers
                    ]
                ],
                "sort": ["popularity:desc"],
            },
        )
    return client.index(f"media_{country_code}").search(
        user_input, {"limit": limit, "sort": ["popularity:desc"]}
    )
