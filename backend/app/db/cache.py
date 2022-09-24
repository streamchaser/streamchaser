import redis.asyncio as aioredis
from pydantic import BaseModel


class Genre(BaseModel):
    label: str
    value: str


# For having all the complex Redis operations
redis = aioredis.from_url("redis://redis")
