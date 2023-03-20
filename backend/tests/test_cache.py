import asyncio

from app.db.cache import redis
from pytest import fixture


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
