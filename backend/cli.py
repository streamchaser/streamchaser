import asyncio
import csv
import datetime
import gzip
import json
import os
import xml.etree.cElementTree as ET
from math import ceil
from pathlib import Path

import httpx
import requests
import typer
from app.api import fetch_genres
from app.api import fetch_jsongz_files
from app.api import fetch_media_ids
from app.config import Environment
from app.config import get_settings
from app.db.cache import redis
from app.db.database import db_client
from app.db.database_service import fetch_countries
from app.db.database_service import fix_genre_ampersand
from app.db.database_service import insert_providers_with_links
from app.db.database_service import remove_stale_media
from app.db.queries.generated import insert_countries
from app.db.queries.generated import insert_genres
from app.db.search import async_client
from app.db.search import client
from app.db.search import search_client_config
from app.util import chunkify
from app.util import coroutine
from meilisearch.errors import MeiliSearchApiError
from tqdm import tqdm

supported_country_codes = get_settings().supported_country_codes

app = typer.Typer()


@app.command()
def add_imdb_ratings(min_votes: int = 50):
    url = "https://datasets.imdbws.com/title.ratings.tsv.gz"

    dir = "../imdb_dumps/"
    Path(dir).mkdir(exist_ok=True)
    res = requests.get(url, stream=True)
    imdb_ratings = {}

    if not res.status_code == 200:
        echo_warning("Failed to download imdb file")
        return

    # First we remove the old files
    if os.path.isdir(dir):
        for file in os.listdir(dir):
            os.remove(os.path.join(dir, file))

    with open(f"{dir}title.ratings.tsv.gz", "wb") as f:
        f.write(res.raw.read())
        echo_success("Downloaded IMDb file")

    with gzip.open(dir + "title.ratings.tsv.gz", "rt") as file:
        tsv_file = csv.reader(file, delimiter="\t")

        for rating in tsv_file:
            imdb_ratings[rating[0]] = {"rating": rating[1], "votes": rating[2]}

    typer.echo("About to fetch all meilisearch media...")

    all_media = client.index("media").get_documents(
        {"fields": ["imdb_id", "id", "title"], "limit": 999_999}
    )

    typer.echo("Adding ratings to meilisearch...")

    imdb_media = [
        {
            "id": media.id,
            "imdb_rating": float(imdb_ratings[media.imdb_id].get("rating")),
        }
        if imdb_ratings.get(media.imdb_id)
        and int(imdb_ratings[media.imdb_id]["votes"]) >= min_votes
        else {"id": media.id, "imdb_rating": None}
        for media in all_media.results
    ]

    client.index("media").update_documents(imdb_media)

    echo_success("Successfully added imdb ratings - indexing might take a while")


@app.command()
def remove_sitemap(no_verify: bool = False):
    if not no_verify:
        typer.confirm("Are you sure you want to remove sitemap files?")
    num = 0
    my_dir = "./static"
    for fname in os.listdir(my_dir):
        if fname.startswith("sitemap"):
            os.remove(os.path.join(my_dir, fname))
            num += 1
    echo_success(f"Removed {num} sitemap file(s)")


@app.command()
@coroutine
async def create_sitemap(sitemap_size: int = 49000):
    typer.echo("First removing old sitemap files")
    remove_sitemap(no_verify=True)
    total_documents = (
        await async_client.index("media").get_stats()
    ).number_of_documents
    offset = 0
    count = 0
    date = datetime.datetime.now().strftime("%Y-%m-%d")
    pages = [
        {"https://streamchaser.tv": 1.0},
        {"https://streamchaser.tv/faq": 0.5},
        {"https://streamchaser.tv/about": 0.5},
    ]

    typer.echo(
        (
            f"About to create {ceil(total_documents / sitemap_size)} sitemaps "
            f"with {sitemap_size} url's in each (total: {total_documents})"
        )
    )

    with tqdm(
        total=ceil(total_documents / sitemap_size),
        desc="Creating sitemaps",
    ) as pbar:
        while offset < total_documents:
            chunked_media = await async_client.index("media").get_documents(
                limit=sitemap_size, offset=offset, fields=["id", "popularity"]
            )
            for media in chunked_media.results:
                url = ""
                if media["id"][0] == "m":
                    url = f"https://streamchaser.tv/movie/{media['id'][1:]}"
                else:
                    url = f"https://streamchaser.tv/tv/{media['id'][1:]}"

                if media["popularity"] > 5:
                    priority = 0.9
                else:
                    priority = 0.8
                pages.append({url: priority})

            root = ET.Element("urlset")
            root.attrib["xmlns"] = "http://www.sitemaps.org/schemas/sitemap/0.9"

            for page in pages:
                url, priority = page.popitem()
                doc = ET.SubElement(root, "url")
                ET.SubElement(doc, "loc").text = url
                ET.SubElement(doc, "priority").text = str(priority)
                ET.SubElement(doc, "lastmod").text = date
                ET.SubElement(doc, "changefreq").text = "daily"

            tree = ET.ElementTree(root)
            tree.write(
                f"./static/sitemap{count+1}.xml",
                encoding="utf-8",
                xml_declaration=True,
            )

            pages = []
            count += 1
            offset += sitemap_size
            pbar.update(1)

    typer.echo("Creating main sitemap file...")

    root = ET.Element("sitemapindex")
    root.attrib["xmlns"] = "http://www.sitemaps.org/schemas/sitemap/0.9"

    for i in range(count):
        doc = ET.SubElement(root, "sitemap")
        ET.SubElement(
            doc, "loc"
        ).text = f"https://api.streamchaser.tv/static/sitemap{i+1}.xml"

    tree = ET.ElementTree(root)
    tree.write("./static/sitemap_index.xml", encoding="utf-8", xml_declaration=True)

    echo_success("Successfully created sitemaps")


@app.command()
def fetch_jsongz():
    fetch_jsongz_files()


@app.command()
def update_ids(ids: list[str]):
    if wrong_ids := [
        id for id in ids if id[0] not in ["m", "t", "p"] or not id[1:].isnumeric()
    ]:
        echo_warning(
            f"One or more of the ids are not formatted correctly: {wrong_ids}\n"
            "The ids will not be sent"
        )
        return
    with httpx.Client(http2=True) as client:
        res = client.post("http://internal:8888/update-media", json={"ids": ids})
        echo_success(res.json()["info"])


@app.command()
def update_media(chunk_size: int, popularity: float = 1):
    """Sends media ids to our internal update-media endpoint in chunks"""
    movie_ids, tv_ids, person_ids = fetch_media_ids(popularity)

    print(
        f"\nAbout to update {len(movie_ids)} movies, {len(tv_ids)} "
        f"TV shows and {len(person_ids)} people "
        f"in chunks of {chunk_size}"
    )

    with httpx.Client(http2=True, timeout=60) as client:
        for media in zip(
            ["movies", "tv shows", "person"], [movie_ids, tv_ids, person_ids]
        ):
            id_chunks, total_chunks = chunkify(media[1], chunk_size)
            for id_chunk in tqdm(
                id_chunks,
                total=total_chunks,
                desc=f"Updating {media[0]}",
            ):
                res = client.post(
                    "http://internal:8888/update-media", json={"ids": id_chunk}
                )
                if res.status_code != 200:
                    echo_warning(res.text)


@app.command()
@coroutine
async def clear_stale_media_from_search(days_for_expiry: int = 3):
    await remove_stale_media(days_for_expiry)


@app.command()
def remove_blacklisted_from_search():
    """Deletes all the ids from blacklist.txt from MeiliSearch"""
    blacklisted_media = [line.rstrip() for line in open("blacklist.txt")]
    client.index("media").delete_documents(blacklisted_media)

    typer.echo(f"Attempted to remove {len(blacklisted_media)} blacklisted media")


@app.command()
@coroutine
async def refresh_redis():
    """Flushes everything then adds genres and providers to Redis"""
    await redis.flushdb()


@app.command()
@coroutine
async def flush_cache():
    """Flushes everything from Redis"""
    await redis.flushdb()


@app.command()
def update_search_config():
    search_client_config()


@app.command()
@coroutine
async def clean_stale_media():
    await remove_stale_media()


@app.command()
@coroutine
async def full_setup(popularity: float = 1, chunk_size: int = 25000):
    await insert_genres(db_client, data=json.dumps(fix_genre_ampersand(fetch_genres())))
    await insert_countries(db_client, data=json.dumps(await fetch_countries()))
    await insert_providers_with_links()
    if get_settings().app_environment == Environment.DEVELOPMENT:
        # Is ran at startup in production
        search_client_config()
    update_media(chunk_size=chunk_size, popularity=popularity)
    # Removes before indexing MeiliSearch
    remove_blacklisted_from_search()

    typer.echo("Waiting for indexing to finish...")

    stats = await async_client.index("media").get_stats()

    while stats.is_indexing:
        await asyncio.sleep(1)
        stats = await async_client.index("media").get_stats()

    echo_success("indexing finished")

    add_imdb_ratings()


@app.command()
def remove_media(media_id: str, blacklist: bool = True):
    """Deletes a media from MeiliSearch and adds it to the blacklist"""
    try:
        media = client.index("media").get_document(media_id)
        typer.confirm(
            f"Are you sure you want to remove & blacklist [{media.title}]?", abort=True
        )
    except MeiliSearchApiError as e:
        typer.echo(e)
        typer.confirm("Are you sure you want to continue?", abort=True)

    typer.echo(f"Removing and blacklisting: {media_id}")
    client.index("media").delete_document(media_id)
    typer.echo("Removed from Meilisearch ✓")

    if blacklist:
        with open("blacklist.txt", "a+") as file:
            file.seek(0)
            if media_id in file.read().splitlines():
                typer.echo(f"{media_id} already in blacklist")
            else:
                file.write(f"{media_id}\n")
                typer.echo("Added to blacklist ✓")

    typer.echo("Meilisearch updated ✓")


def echo_success(msg: str):
    typer.echo(
        typer.style(
            msg,
            fg=typer.colors.GREEN,
            bold=True,
        )
    )


def echo_warning(msg: str):
    typer.echo(
        typer.style(
            msg,
            fg=typer.colors.RED,
            bold=True,
        )
    )


if __name__ == "__main__":
    app()
