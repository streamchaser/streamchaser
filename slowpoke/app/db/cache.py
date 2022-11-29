from pydantic import BaseModel
from redis.asyncio import from_url


class Genre(BaseModel):
    label: str
    value: str


# For having all the complex Redis operations
redis = from_url("redis://redis")
