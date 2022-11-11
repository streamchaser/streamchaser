from enum import Enum

from app.db.search import async_client
from fastapi import APIRouter
from fastapi import Path
from fastapi import Query


router = APIRouter(
    prefix="/search",
    tags=["search"],
    responses={404: {"description": "Not found"}},
)


class Order(Enum):
    ASCENDING = "asc"
    DESCENDING = "desc"


def sort_from_queries(release_date: Order | None, popularity: Order | None) -> list:
    sort = []

    match release_date:
        case Order.ASCENDING:
            sort.append("release_date:asc")
        case Order.DESCENDING:
            sort.append("release_date:desc")

    match popularity:
        case Order.ASCENDING:
            sort.append("popularity:asc")
        case Order.DESCENDING:
            sort.append("popularity:desc")

    return sort


def filter_from_queries(
    providers: list | None = None,
    genres: list | None = None,
    types: list | None = None,
    only_providers: bool = False,
) -> list:
    filter = []

    if providers:
        filter.append([f'provider_names="{provider}"' for provider in providers])
    else:
        if only_providers:
            filter.append(['provider_names!=""'])

    if genres:
        filter = filter + [f'genres="{genre}"' for genre in genres]

    if types:
        filter.append([f'type="{type}"' for type in types])

    return filter


@router.get("/{user_input}")
async def search(
    user_input: str = Path("*", description="The main query string"),
    limit: int = Query(
        20, description="Control the maximum amount of shown search results"
    ),
    c: str = Query("DK", description="Country code"),
    only_providers: bool = Query(False, description="Only media with providers"),
    g: list[str] | None = Query(None, description="Genres"),
    p: list[str] | None = Query(None, description="Providers"),
    t: list[str] | None = Query(None, description="Content type"),
    release_date: Order | None = Query(None, description="Release date sorting"),
    popularity: Order | None = Query(None, description="Popularity sorting"),
):
    """
    # Our endpoint for the MeiliSearch API
    This the main driver of the index page
    """

    country_code = c.upper()

    # Default sorting if no user_input
    if user_input == "*":
        sort = sort_from_queries(release_date=None, popularity=Order.DESCENDING)
    else:
        sort = sort_from_queries(release_date=None, popularity=None)

    if release_date or popularity:
        sort = sort_from_queries(release_date=release_date, popularity=popularity)

    filter = filter_from_queries(
        providers=p, genres=g, types=t, only_providers=only_providers
    )

    return await async_client.index(f"media_{country_code}").search(
        user_input,
        limit=limit,
        sort=sort,
        filter=filter,
    )
