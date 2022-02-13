from aioredis import from_url
from pydantic_aioredis import Model
from pydantic_aioredis import RedisConfig
from pydantic_aioredis import Store


class Genre(Model):
    # the _primary_key_field is mandatory
    _primary_key_field: str = "name"
    name: str
    value: str


# For using Redis through Pydantic models
store = Store(name="cache", redis_config=RedisConfig(host="redis"))
store.register_model(Genre)

# For having all the complex Redis operations
redis = from_url("redis://redis")
