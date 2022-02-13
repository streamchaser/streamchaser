from app.db.cache import Genre
from app.db.database_service import insert_genres_to_cache
from pytest import fixture

test_genre_dict = {
    1: "NoAmpersands",
    2: "One & Ampersand",
    3: "A & Lot & of & Ampersands",
}


@fixture(autouse=True)
async def clear_db():
    """
    Setup the test database.
    """
    await Genre.delete()
    assert not await Genre.select()
    yield
    await Genre.delete()


async def test_insert_genres_to_cache():
    """
    Test that the genre cache is created and populated correctly.
    """
    await insert_genres_to_cache(test_genre_dict)

    genres = await Genre.select()

    assert genres
    assert len(genres) == 3
    for genre in genres:
        assert "&" not in genre.value
