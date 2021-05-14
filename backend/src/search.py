import meilisearch


client = meilisearch.Client('http://search:7700', 'masterKey')

# An index where the movies are stored
client.index('media').update_attributes_for_faceting([
    'genres',
    'specific_provider_names'
])

# Isolated the important
client.index('media').update_searchable_attributes([
    'original_title',
    'title'
])
