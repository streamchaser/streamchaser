import meilisearch
from api_helpers import SUPPORTED_COUNTRY_CODES

client = meilisearch.Client('http://search:7700', 'masterKey')

# An index where the movies are stored

for country_code in SUPPORTED_COUNTRY_CODES:
    client.index(f'media_{country_code}').update_filterable_attributes([
        'genres',
        'specific_provider_names'
    ])

    # Isolated the important
    client.index(f'media_{country_code}').update_searchable_attributes([
        'original_title',
        'title'
    ])
