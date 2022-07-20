from app.db.search import client


class TestMediaLookup:
    def test_lookup_single_id(self):
        search_results = client.index("media_TEST").search(
            "*", {"filter": [['id = "m340102"']]}
        )

        assert search_results["nbHits"] == 1

        hit_ids = [hit["id"] for hit in search_results["hits"]]
        assert "m340102" in hit_ids

    def test_lookup_multiple_ids(self):
        search_results = client.index("media_TEST").search(
            "*", {"filter": [['id = "m340102"', 'id = "t205051"', 'id = "t1877"']]}
        )

        assert search_results["nbHits"] == 3

        hit_ids = [hit["id"] for hit in search_results["hits"]]
        expected_ids = ["m340102", "t205051", "t1877"]

        for id in expected_ids:
            assert id in hit_ids
