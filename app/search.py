import meilisearch
client = meilisearch.Client('http://search:7700', 'masterKey')

# An index where the movies are stored
index = client.index('movies')
