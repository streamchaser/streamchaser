from enum import Enum

from fastapi import APIRouter, Path, Query

from app.db.search import async_client
from app.models import Meilisearch

router = APIRouter(
    prefix="/search",
    tags=["search"],
    responses={404: {"description": "Not found"}},
)


class Order(Enum):
    ASCENDING = "asc"
    DESCENDING = "desc"


def sort_from_queries(
    release_date: Order | None, popularity: Order | None, imdb_rating: Order | None
) -> list:
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

    match imdb_rating:
        case Order.ASCENDING:
            sort.append("imdb_rating:asc")
        case Order.DESCENDING:
            sort.append("imdb_rating:desc")

    return sort


def filter_from_queries(
    country_code: str,
    providers: list | None = None,
    genres: list | None = None,
    types: list | None = None,
    only_providers: bool = False,
    min_imdb: float | None = None,
) -> list:
    filter = []

    if providers:
        flatrate = [
            f'providers.results.{country_code}.flatrate.provider_name ="{provider}"'
            for provider in providers
        ]
        free = [
            f'providers.results.{country_code}.free.provider_name ="{provider}"'
            for provider in providers
        ]
        filter = [flatrate + free]
    else:
        if only_providers:
            filter.append(f'supported_provider_countries = "{country_code}"')

    if genres:
        filter = filter + [f'genres="{genre}"' for genre in genres]

    if types:
        filter.append([f'type="{type}"' for type in types])

    if min_imdb:
        filter.append([f"imdb_rating >= {min_imdb}"])

    return filter


@router.get("/{user_input}", response_model=Meilisearch)
async def search(
    user_input: str = Path("*", description="The main query string"),
    limit: int = Query(
        20, description="Control the maximum amount of shown search results"
    ),
    c: str = Query("DK", description="Country code"),
    only_providers: bool = Query(False, description="Only media with providers"),
    min_imdb: float | None = Query(None, description="Filter by minimum IMDb rating"),
    g: list[str] | None = Query(None, description="Genres"),
    p: list[str] | None = Query(None, description="Providers"),
    t: list[str] | None = Query(None, description="Content type"),
    release_date: Order | None = Query(None, description="Release date sorting"),
    popularity: Order | None = Query(None, description="Popularity sorting"),
    imdb_rating: Order | None = Query(None, description="IMDb rating sorting"),
) -> Meilisearch:
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

    # Default sorting if no user_input
    if user_input == "*":
        sort = sort_from_queries(
            release_date=None, popularity=Order.DESCENDING, imdb_rating=None
        )
    else:
        sort = sort_from_queries(release_date=None, popularity=None, imdb_rating=None)

    if release_date or popularity or imdb_rating:
        sort = sort_from_queries(
            release_date=release_date, popularity=popularity, imdb_rating=imdb_rating
        )

    filter = filter_from_queries(
        country_code=country_code,
        providers=p,
        genres=g,
        types=t,
        only_providers=only_providers,
        min_imdb=min_imdb,
    )

    return await async_client.index("media").search(
        user_input,
        limit=limit,
        sort=sort,
        filter=filter,
        attributes_to_retrieve=[
            f"providers.results.{country_code}",
            "title",
            "poster_path",
            "id",
            "imdb_rating",
        ],
    )
