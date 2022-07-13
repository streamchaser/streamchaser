from app.db.search import client
from tests.conftest import test_data


class TestFilters:
    def test_no_filters(self):
        """Tests ability to filter for movie, tv-series and maybe person later"""

        search_results = client.index("media_TEST").search("*")

        assert search_results["nbHits"] == len(test_data)

    def test_type_movie(self):
        search_results = client.index("media_TEST").search(
            "*", {"filter": "type=movie"}
        )

        assert "movie" in [media["type"] for media in search_results["hits"]]
        assert "tv" not in [media["type"] for media in search_results["hits"]]

    def test_type_tv(self):
        search_results = client.index("media_TEST").search("*", {"filter": "type=tv"})

        assert "tv" in [media["type"] for media in search_results["hits"]]
        assert "movie" not in [media["type"] for media in search_results["hits"]]

    def test_type_movie_and_tv(self):
        search_results = client.index("media_TEST").search(
            "*", {"filter": [["type=movie", "type=tv"]]}
        )

        assert "movie" and "tv" in [media["type"] for media in search_results["hits"]]
