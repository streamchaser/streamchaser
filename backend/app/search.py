import meilisearch
from config import get_settings

client = meilisearch.Client('http://search:7700', 'masterKey')

supported_country_codes = get_settings().supported_country_codes

# An index where the movies are stored
for country_code in supported_country_codes:
    client.index(f'media_{country_code}').update_filterable_attributes([
        'genres',
        'specific_provider_names'
    ])

    # Isolated the important
    client.index(f'media_{country_code}').update_searchable_attributes([
        'original_title',
        'title'
    ])
