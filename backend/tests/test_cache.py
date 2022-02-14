from app.db.cache import Genre
from app.db.database_service import insert_genres_to_cache
from pytest import fixture

test_genre_dict = {
    1: "NoAmpersands",
    2: "One & Ampersand",
    3: "A & Lot & of & Ampersands",
}


@fixture(autouse=True, scope="module")
async def prepare_db():
    """
    Setup the test database at module scope
    Makes sure the db is empty before the first test
    """
    await Genre.delete()
    yield


@fixture(autouse=True)
async def reset_db():
    """
    Cleans up after each test at function scope
    """
    yield
    await Genre.delete()


async def test_insert_genres_to_cache():
    """
    Test that the genre cache is created and populated correctly.
    """
    assert not await Genre.select()
    await insert_genres_to_cache(test_genre_dict)

    genres = await Genre.select()

    assert genres
    assert len(genres) == 3
    for genre in genres:
        assert "&" not in genre.value
