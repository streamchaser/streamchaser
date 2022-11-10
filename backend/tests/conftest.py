import pytest
from app.db.search import client
from app.db.search import search_client_config

test_data = [
    {
        "id": "m340102",
        "type": "movie",
        "title": "The New Mutants",
        "original_title": "The New Mutants",
        "overview": "The New Mutants overview",
        "release_date": "2020-08-26",
        "genres": ["Horror", "Science Fiction", "Mystery", "Action"],
        "poster_path": "/xZNw9xxtwbEf25NYoz52KdbXHPM.jpg",
        "popularity": 89,
        "provider_names": ["HBO Max"],
        "providers": [
            {
                "display_priority": 8,
                "logo_path": "/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg",
                "provider_id": 384,
                "provider_name": "HBO Max",
            }
        ],
    },
    {
        "id": "m283700",
        "type": "movie",
        "title": "Pasolini",
        "original_title": "Pasolini",
        "overview": "Pasolini overview",
        "release_date": "2014-09-25",
        "genres": ["History", "Drama"],
        "poster_path": "/fTtlV5ZRKkncPzr7tQyadYKZGcP.jpg",
        "popularity": 8,
        "provider_names": [],
        "providers": [],
    },
    {
        "id": "t205051",
        "type": "tv",
        "title": "Pela Estrada Fora",
        "original_title": "Pela Estrada Fora",
        "overview": "",
        "release_date": "2022-06-30",
        "genres": ["Documentary"],
        "poster_path": "/cZwGewRof3bLIlKLfAaBeGCnahC.jpg",
        "popularity": 3,
        "provider_names": [],
        "providers": [],
    },
    {
        "id": "t1877",
        "type": "tv",
        "title": "Phineas and Ferb",
        "original_title": "Phineas and Ferb",
        "overview": "Phineas and Ferb overview",
        "release_date": "2007-08-17",
        "genres": ["Animation", "Comedy", "Family", "Sci-Fi & Fantasy"],
        "poster_path": "/5M1KD34oDBjnmVQhdvoVNYgMugc.jpg",
        "popularity": 64,
        "provider_names": ["Disney Plus"],
        "providers": [
            {
                "display_priority": 30,
                "logo_path": "/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg",
                "provider_id": 337,
                "provider_name": "Disney Plus",
            }
        ],
    },
]


@pytest.fixture(scope="session", autouse=True)
def setup_meilisearch():
    """Session scoped fixture that prepares the MeiliSearch test index"""

    search_client_config("TEST")
    client.index("media_TEST").delete_all_documents()
    task = client.index("media_TEST").add_documents(test_data)
    print("task", task)
    client.wait_for_task(
        task.task_uid
    )  # Makes sure the database is ready for the tests
    yield
    client.index("media_TEST").delete_all_documents()
