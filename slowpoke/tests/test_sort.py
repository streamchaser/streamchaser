from app.db.search import client


class TestPopularitySort:
    def test_popularity_ascending(self):
        search_results = client.index("media_TEST").search(
            "*", {"sort": ["popularity:asc"]}
        )
        hit_popularities = [hit["popularity"] for hit in search_results["hits"]]

        assert sorted(hit_popularities) == hit_popularities

    def test_popularity_descending(self):
        search_results = client.index("media_TEST").search(
            "*", {"sort": ["popularity:desc"]}
        )
        hit_popularities = [hit["popularity"] for hit in search_results["hits"]]

        assert sorted(hit_popularities, reverse=True) == hit_popularities


class TestReleaseDateSort:
    def test_release_date_ascending(self):
        search_results = client.index("media_TEST").search(
            "*", {"sort": ["release_date:asc"]}
        )
        hit_release_dates = [hit["release_date"] for hit in search_results["hits"]]

        assert sorted(hit_release_dates) == hit_release_dates

    def test_release_date_descending(self):
        search_results = client.index("media_TEST").search(
            "*", {"sort": ["release_date:desc"]}
        )
        hit_release_dates = [hit["release_date"] for hit in search_results["hits"]]

        assert sorted(hit_release_dates, reverse=True) == hit_release_dates
