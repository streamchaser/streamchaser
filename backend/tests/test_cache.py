import asyncio

from app.db.cache import redis
from app.db.database_service import fix_genre_ampersand
from pytest import fixture

test_genre_dict = {
    1: "NoAmpersands",
    2: "One & Ampersand",
    3: "A & Lot & of & Ampersands",
}


@fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@fixture(autouse=True, scope="session")
async def prepare_db():
    """
    Setup the test database at session scope
    Makes sure the db is empty before starting a test session
    """
    await redis.flushdb()
    yield


@fixture(autouse=True)
async def reset_db():
    """
    Cleans up after each test at function scope
    """
    yield
    await redis.flushdb()


async def test_fix_genre_ampersand():
    genres = fix_genre_ampersand(test_genre_dict)

    assert genres
    assert len(genres) == 3
    assert "&" in genres[2]["label"]
    for genre in genres:
        assert "&" not in genre["value"]
