import json

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

    print("in index_media()")

    # Filters empty provider dicts out
    # The ones that only have provider types we dont support(yet)
    supported_providers = ["flatrate", "free"]
    medias = []
    print("len db_media", len(db_media))
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

    client.index("a_test_index").add_documents(medias)

    print("len medias", len(medias))


async def extract_unique_providers_to_cache():
    db = database.SessionLocal()
    db_media = get_all_media(db)

    supported_countries = {x: set() for x in get_settings().supported_country_codes}

    for media in db_media:
        if media.providers:
            filtered_countries = [
                country
                for country in list(media.providers.keys())
                if country in supported_countries
            ]
            for country_code in filtered_countries:
                for provider_type in ["flatrate", "free"]:
                    if providers := media.providers.get(country_code).get(
                        provider_type
                    ):
                        for provider in providers:
                            supported_countries[country_code].add(
                                provider["provider_name"]
                            )

    for country_code in get_settings().supported_country_codes:
        providers: set = supported_countries[country_code]
        ordered_providers: list = sorted(providers)

        await redis.set(
            f"{country_code}_providers",
            json.dumps(ordered_providers),
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
