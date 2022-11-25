import asyncio
import json

import httpx
from app import schemas
from app.config import get_settings
from app.db import crud
from app.db import database
from app.db.cache import Genre
from app.db.cache import redis
from app.db.crud import get_all_media
from app.db.search import client
from tqdm import tqdm


async def insert_genres_to_cache(genres: dict) -> None:
    """Turns a dict of genres into Genre-schemas, and feeds them to crud create"""

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


def index_media():
    db = database.SessionLocal()
    db_media = get_all_media(db)

    # Filters empty provider dicts out
    # The ones that only have provider types we dont support(yet)
    supported_providers = ["flatrate", "free"]
    medias = []
    for media in tqdm(db_media, desc="Building documents for meilisearch"):
        supported_provider_countries = [
            country_code
            for country_code in list(media.providers.keys())
            if any(
                [
                    media.providers[country_code].get(provider_type)
                    for provider_type in supported_providers
                ]
            )
        ]

        medias.append(
            schemas.Media(
                id=media.id,
                type="movie" if media.id[0] == "m" else "tv",
                title=media.title,
                original_title=media.original_title,
                overview=media.overview,
                release_date=media.release_date,
                genres=media.genres,
                poster_path=media.poster_path,
                popularity=media.popularity,
                providers=media.providers,
                supported_provider_countries=supported_provider_countries,
            ).dict()
        )

    client.index("media").add_documents(medias)


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
        for res in tqdm(group, desc="Adding each country's providers to Redis"):
            __update_providers(res.json())

    for country_code, provider_data in providers.items():
        sorted_provider_data = sorted(provider_data, key=lambda k: k["provider_name"])
        await redis.set(
            f"{country_code}_providers",
            json.dumps(sorted_provider_data),
        )


def prune_non_ascii_media_from_db():
    """Removes media with no genres or Animation that cannot be encoded with ASCII"""

    try:
        db = database.SessionLocal()
        media_list = crud.get_all_media(db=db)
        pbar_media_list = tqdm(media_list)
        pbar_media_list.set_description("Finding non-ASCII in titles")

        for media in pbar_media_list:
            if media.genres.__contains__("Animation") or len(media.genres) == 0:

                for letter in media.original_title:
                    try:
                        letter.encode(encoding="utf-8").decode("ascii")
                    except UnicodeDecodeError:
                        crud.delete_media_by_id(db=db, media_id=media.id)
                        break
        print("Media with non-ASCII titles have been pruned")
    except Exception as e:
        print(e)
