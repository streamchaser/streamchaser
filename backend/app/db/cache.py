from aioredis import from_url
from pydantic import BaseModel


class Genre(BaseModel):
    label: str
    value: str


# For having all the complex Redis operations
redis = from_url("redis://redis")
