import meilisearch
import meilisearch_python_async

client = meilisearch.Client("http://search:7700", "masterKey")
async_client = meilisearch_python_async.Client("http://search:7700", "masterKey")


def search_client_config(index: str = "media"):
    client.index(index).update_filterable_attributes(
        ["genres", "providers", "supported_provider_countries", "type", "id"]
    )

    # Isolated the important
    client.index(index).update_searchable_attributes(
        ["original_title", "title", "title_translations"]
    )

    client.index(index).update_sortable_attributes(["popularity", "release_date"])

    client.index(index).update_ranking_rules(
        [
            "words",
            "exactness",
            "sort",
            "popularity:desc",
            "typo",
            "attribute",
            "proximity",
        ]
    )

    client.index(index).update_settings(
        {"synonyms": {"and": ["&"], "og": ["&"], "&": ["and", "og"]}}
    )
