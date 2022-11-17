import meilisearch
import meilisearch_python_async
from app.config import get_settings

client = meilisearch.Client("http://search:7700", "masterKey")
async_client = meilisearch_python_async.Client("http://search:7700", "masterKey")


def search_client_config(country_code: str):
    client.index(f"media_{country_code}").update_filterable_attributes(
        ["genres", "provider_names", "type", "id"]
    )

    # Isolated the important
    client.index(f"media_{country_code}").update_searchable_attributes(
        ["original_title", "title"]
    )

    client.index(f"media_{country_code}").update_sortable_attributes(
        ["popularity", "release_date"]
    )

    # Sort is moved higher than default
    client.index(f"media_{country_code}").update_ranking_rules(
        ["words", "sort", "typo", "proximity", "attribute", "exactness"]
    )


def search_client_config_v2():
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


def update_index():
    supported_country_codes = get_settings().supported_country_codes

    for country_code in supported_country_codes:
        search_client_config(country_code=country_code)
