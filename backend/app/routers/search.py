from typing import List, Optional

from fastapi import Query
from fastapi import APIRouter
from search import client


router = APIRouter(
    prefix="/search",
    tags=["search"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{user_input}")
async def search(
    user_input: str,
    c: str,
    g: Optional[List[str]] = Query(None),
    p: Optional[List[str]] = Query(None),
):
    """
    # Our endpoint for the MeiliSearch API
    * **user_input**: Input to lookup media
    * **g**: Optional genre query
    * **p**: Optional provider query
    """
    genres = g
    providers = p
    country_code = c

    if genres and providers:
        genre_list: List[str] = [f'genres="{genre}"' for genre in genres]
        provider_list: List[List[str]] = [
            [f'specific_provider_names="{providers}"' for providers in providers]
        ]

        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": 21,
                "filter": genre_list + provider_list,
                "sort": ["popularity:desc"],
            },
        )
    elif genres:
        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": 21,
                # This is using AND logic
                "filter": [f'genres="{genre}"' for genre in genres],
                "sort": ["popularity:desc"],
            },
        )
    elif providers:
        return client.index(f"media_{country_code}").search(
            user_input,
            {
                "limit": 21,
                # This is using OR logic
                "filter": [
                    [
                        f'specific_provider_names="{providers}"'
                        for providers in providers
                    ]
                ],
                "sort": ["popularity:desc"],
            },
        )
    return client.index(f"media_{country_code}").search(
        user_input, {"limit": 21, "sort": ["popularity:desc"]}
    )
