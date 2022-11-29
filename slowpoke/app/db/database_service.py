import asyncio
import json

import httpx
from app.config import get_settings
from app.db.cache import Genre
from app.db.cache import redis
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
