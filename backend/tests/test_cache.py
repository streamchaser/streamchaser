from app.db.cache import Genre
from app.db.database_service import insert_genres_to_cache
from pytest import fixture

test_genre_dict = {
    1: "NoSpaces",
    2: "Two Spaces",
    3: "A Lot of Spaces",
}


@fixture(autouse=True)
async def clear_db():
    """
    Setup the test database.
    """
    await Genre.delete()
    yield


async def test_create_genre_cache():
    """
    Test that the genre cache is created and populated correctly.
    """
    assert not await Genre.select()

    await insert_genres_to_cache(test_genre_dict)

    assert await Genre.select()
    assert len(await Genre.select()) == 3
