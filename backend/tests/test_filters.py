from app.db.search import client
from app.routers.search import filter_from_queries
from tests.conftest import test_data


class TestFilters:
    def test_no_filters(self):
        """Baseline raw query, gets all the data"""

        search_results = client.index("media_TEST").search("*")

        assert search_results["nbHits"] == len(test_data)


class TestTypeFilter:
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


class TestFilterFromQueries:
    """Tests the functionality of filter_from_queries()
    which is used to turn the index page queries into a MeiliSearch filter
    """

    def test_filter_from_queries_empty(self):
        """Empty list that shouldn't lead to any filtering"""

        filter = filter_from_queries()
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == len(test_data)

    def test_filter_from_queries_providers(self):
        """Proves only 1 provider needs to match something"""

        filter = filter_from_queries(providers=["Disney Plus"])
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == 1
        assert "Disney Plus" in search_results["hits"][0]["provider_names"]

        filter = filter_from_queries(providers=["Disney Plus", "HBO Max"])
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == 2
        assert ["Disney Plus"] and ["HBO Max"] in [
            hit["provider_names"] for hit in search_results["hits"]
        ]

    def test_filter_from_queries_genres(self):
        """Proves all genres needs to match something"""

        filter = filter_from_queries(genres=["Family"])
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == 1
        assert "Family" in search_results["hits"][0]["genres"]

        filter = filter_from_queries(genres=["Family", "Not a real genre"])
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == 0

    def test_filter_from_queries_types(self):
        """Proves only 1 type needs to match something"""

        filter = filter_from_queries(types=["movie", "tv"])
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == len(test_data)
        assert "movie" and "tv" in [media["type"] for media in search_results["hits"]]

        filter = filter_from_queries(types=["movie"])
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert "movie" in [media["type"] for media in search_results["hits"]]
        assert "tv" not in [media["type"] for media in search_results["hits"]]

    def test_filter_from_queries_all_queries(self):
        """Tests for unexpected behavior when applying multiple filters"""

        filter = filter_from_queries(
            providers=["HBO Max"], genres=["Action", "Horror"], types=["movie", "tv"]
        )
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == 1
        assert "HBO Max" in search_results["hits"][0]["provider_names"]
        assert "Action" and "Horror" in search_results["hits"][0]["genres"]

        filter = filter_from_queries(
            providers=["HBO Max"], genres=["A genre that isnt there"]
        )
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == 0

        filter = filter_from_queries(
            providers=["A provider that isnt there"], genres=["Action"]
        )
        search_results = client.index("media_TEST").search("*", {"filter": filter})

        assert search_results["nbHits"] == 0
