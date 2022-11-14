from app.db.crud import get_all_media
from app.db.database import SessionLocal
from app.db.search import client
from pydantic.main import BaseModel


# [
#     "id",
#     "created_at",
#     "updated_at",
#     "title",
#     "original_title",
#     "overview",
#     "release_date",
#     "genres",
#     "poster_path",
#     "popularity",
#     "providers",
# ]
class NewMeiliMedia(BaseModel):
    id: str
    title: str
    # original_title: str
    # overview: str
    release_date: str
    genres: list[str]
    providers: dict


def psql_to_meili():
    db = SessionLocal()
    media = get_all_media(db)

    new_meili_media_list: list[dict] = []
    for m in media:
        new_meili_media_list.append(
            NewMeiliMedia(
                id=m.id,
                title=m.title,
                release_date=m.release_date,
                genres=m.genres,
                providers=m.providers,
            ).dict()
        )

    client.create_index("a_test_index")
    task = client.index("a_test_index").add_documents(new_meili_media_list)
    client.wait_for_task(
        task.task_uid
    )  # Makes sure the database is ready for the tests


class TestIndexing:
    # TODO: PoC testing stuff mode - Not an actual test
    def test_indexing(self):
        """
        # Python version
        Format: PSQL and MeiliSearch has the same data(minus created_at and updated_at)
        Indexing: Fairly straight forward Pydantic model transfer
        Usage: Frontend -> /search -> Meili ->
            /search throws providers of the country into a list in
            something close to the old model ->
            Frontend gets data that is close to pre-meili 0.28
        """
        psql_to_meili()

        client.index("a_test_index").update_filterable_attributes(
            ["genres", "providers", "type", "id"]
        )

        # Isolated the important
        client.index("a_test_index").update_searchable_attributes(
            ["original_title", "title"]
        )

        client.index("a_test_index").update_sortable_attributes(
            ["popularity", "release_date"]
        )

        # Sort is moved higher than default
        client.index("a_test_index").update_ranking_rules(
            ["words", "sort", "typo", "proximity", "attribute", "exactness"]
        )

        search_results = client.index("a_test_index").search(
            "*", {"filter": ["providers.NL.flatrate.provider_name = KPN"]}
        )
        print(search_results["estimatedTotalHits"]),

        search_results = client.index("a_test_index").search("*")
        print(search_results["estimatedTotalHits"]),

        print([m["providers"] for m in search_results["hits"]][0])
        assert False
