import edgedb


db_client = edgedb.create_async_client(
    host="edgedb",
    port=5656,
    tls_security="insecure",
    database="edgedb",
    user="edgedb",
)
