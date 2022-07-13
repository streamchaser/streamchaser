from app.db.search import async_client
from fastapi import APIRouter
from fastapi import Query


router = APIRouter(
    prefix="/search",
    tags=["search"],
    responses={404: {"description": "Not found"}},
)


def filter_from_queries(
    providers: list | None = None, genres: list | None = None, types: list | None = None
) -> list:
    filter = []

    if providers:
        filter.append([f'provider_names="{provider}"' for provider in providers])

    if genres:
        filter = filter + [f'genres="{genre}"' for genre in genres]

    if types:
        filter.append([f'type="{type}"' for type in types])

    return filter


@router.get("/{user_input}")
async def search(
    user_input: str,
    limit: int = 20,
    c: str = "DK",
    g: list[str] | None = Query(None),
    p: list[str] | None = Query(None),
    t: list[str] | None = Query(None),
):
    """
    # Our endpoint for the MeiliSearch API
    * **user_input**: Input to lookup media
    * **limit**: Amount of results to return
    * **c**: Country code(defaulting to Denmark)
    * **g**: Optional genre query
    * **p**: Optional provider query
    * **t**: Optional type query
    """
    country_code = c.upper()

    filter = filter_from_queries(providers=p, genres=g, types=t)

    return await async_client.index(f"media_{country_code}").search(
        user_input,
        limit=limit,
        sort=["popularity:desc"],
        filter=filter,
    )
