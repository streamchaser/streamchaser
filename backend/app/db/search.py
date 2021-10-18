import meilisearch
from app.config import get_settings

client = meilisearch.Client('http://search:7700', 'masterKey')

supported_country_codes = get_settings().supported_country_codes


def update_index():
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

        client.index(f'media_{country_code}').update_sortable_attributes([
            'popularity'
        ])

        # Sort is moved higher than default
        client.index(f'media_{country_code}').update_ranking_rules([
            'words',
            'sort',
            'typo',
            'proximity',
            'attribute',
            'exactness'
        ])
