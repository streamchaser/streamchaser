import asyncio
import json
from datetime import date
from datetime import timedelta

import httpx
from app.config import get_settings
from app.db.cache import Genre
from app.db.cache import redis
from app.db.search import async_client
from app.db.search import client
from tqdm import tqdm


async def insert_genres_to_cache(genres: dict) -> None:
    """Turns a dict of genres into Genre-models, and feeds them to Redis"""

    fixed_genres = [
        Genre(
            label=genre,
            value=genre.replace(" & ", "%20%26%20"),
        ).dict()
        if " & " in genre
        else Genre(label=genre, value=genre).dict()
        for genre in genres.values()
    ]

    fixed_genres.sort(key=lambda genre: genre["label"])

    await redis.set("genres", json.dumps(fixed_genres))


async def countries_to_redis():
    countries_url = (
        f"{get_settings().tmdb_url}"
        f"configuration/countries?api_key={get_settings().tmdb_key}"
    )
    async with httpx.AsyncClient(http2=True) as client:
        res = await client.get(countries_url)

    countries = res.json()
    for country in countries:
        country["name"] = country["english_name"]
        country.pop("english_name", None)
        country.pop("native_name", None)

    await redis.set("countries", json.dumps(countries))


async def providers_to_redis():
    providers = {}
    countries_url = (
        f"{get_settings().tmdb_url}"
        f"configuration/countries?api_key={get_settings().tmdb_key}"
    )
    providers_movie_url = (
        f"{get_settings().tmdb_url}"
        f"watch/providers/movie?api_key={get_settings().tmdb_key}"
    )
    providers_tv_url = (
        f"{get_settings().tmdb_url}"
        f"watch/providers/tv?api_key={get_settings().tmdb_key}"
    )

    def __update_providers(fetched_providers: dict):
        for provider in fetched_providers["results"]:
            for country_code, display_priority in provider[
                "display_priorities"
            ].items():
                if country_code in providers.keys():
                    if provider["provider_name"] not in [
                        provider["provider_name"]
                        for provider in providers[country_code]
                    ]:
                        providers[country_code].append(
                            {
                                "provider_name": provider["provider_name"],
                                "display_priority": display_priority,
                            }
                        )

    async with httpx.AsyncClient(http2=True) as client:
        res = await client.get(countries_url)
        for country in res.json():
            providers.update({country["iso_3166_1"]: []})

        group = await asyncio.gather(
            client.get(providers_movie_url), client.get(providers_tv_url)
        )
        for res in group:
            __update_providers(res.json())

    for country_code, provider_data in tqdm(
        providers.items(), desc="Adding each country's providers to Redis"
    ):
        sorted_provider_data = sorted(provider_data, key=lambda k: k["provider_name"])
        await redis.set(
            f"{country_code}_providers",
            json.dumps(sorted_provider_data),
        )


async def remove_stale_media(days_for_expiry=3):
    """Will remove all media that havn't been updated in 3 days
    (the ones that float around 1 popularity or have been removed by TMDB)"""
    print(f"Removing media that hasn't been updated the last {days_for_expiry} days")
    expiry_date = (date.today() - timedelta(days_for_expiry)).strftime("%s")

    estimated_total_hits = 1000
    while estimated_total_hits == 1000:  # 1000 means there is probably more
        documents = await async_client.index("media").search(
            limit=1000,  # Max limit is 1000
            filter=[f"updated_at_unix < {expiry_date}"],
            sort=["updated_at_unix:asc"],
            attributes_to_retrieve=[
                "id",
            ],
        )

        estimated_total_hits = documents.estimated_total_hits

        ids = [document["id"] for document in documents.hits]

        if ids:
            task = await async_client.index("media").delete_documents(ids)

            client.wait_for_task(uid=task.task_uid)
