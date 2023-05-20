import asyncio
import json
from collections import namedtuple
from datetime import date, timedelta

import httpx
from app.config import get_settings
from app.db.cache import Genre
from app.db.database import db_client
from app.db.queries.generated import (
    insert_providers,
    select_countries,
    update_country_providers,
)
from app.db.search import async_client, client
from tqdm import tqdm

LocalProviders = namedtuple("LocalProviders", ["country_code", "providers"])


async def fetch_local_providers(client: httpx.AsyncClient, country_code: str):
    tmdb = get_settings().tmdb_url
    key = get_settings().tmdb_key

    url = f"{tmdb}watch/providers/movie?api_key={key}&watch_region="

    res = await client.get(f"{url}{country_code}")

    return LocalProviders(country_code, res.json())


async def insert_providers_with_links():
    countries = await select_countries(db_client)

    local_providers = []
    print("Fetching provider data. Amount:", len(countries))
    async with httpx.AsyncClient() as client:
        tasks = [fetch_local_providers(client, country.value) for country in countries]
        local_providers: list[LocalProviders] = await asyncio.gather(*tasks)

    skipped = 0
    pbar = tqdm(
        local_providers, desc="Inserting provider data and updating country links"
    )
    for lp in pbar:
        if local_providers := lp.providers.get("results"):
            await insert_providers(db_client, data=json.dumps(local_providers))

            # Picks the local display priorities
            local_display_priorities = [
                {
                    "display_priority": provider["display_priorities"][lp.country_code],
                    "provider_id": provider["provider_id"],
                }
                for provider in lp.providers["results"]
            ]
            await update_country_providers(
                db_client,
                country_code=lp.country_code,
                providers=json.dumps(local_display_priorities),
            )
        else:
            skipped += 1
            pbar.set_postfix(skipped=skipped)


def fix_genre_ampersand(genres: dict) -> list[dict]:
    fixed_genres = [
        Genre(
            label=genre,
            value=genre.replace(" & ", "%20%26%20"),
        ).dict()
        if " & " in genre
        else Genre(label=genre, value=genre).dict()
        for genre in genres.values()
    ]

    return sorted(fixed_genres, key=lambda genre: genre["label"])


async def fetch_countries() -> list[dict[str, str]]:
    countries_url = (
        f"{get_settings().tmdb_url}"
        f"configuration/countries?api_key={get_settings().tmdb_key}"
    )
    async with httpx.AsyncClient(http2=True) as client:
        res = await client.get(countries_url)

    countries: list[dict[str, str]] = res.json()
    for country in tqdm(countries, desc="Creating flags"):
        country_code = country["iso_3166_1"]
        unicode_flag = chr(ord(country_code[0]) + 127397) + chr(
            ord(country_code[1]) + 127397
        )

        country["label"] = f"{unicode_flag} {country['english_name']}"
        country["value"] = country_code

        country.pop("english_name", None)
        country.pop("native_name", None)
        country.pop("iso_3166_1", None)

    return countries


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
