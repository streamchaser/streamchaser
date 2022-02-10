import aioredis


redis = aioredis.from_url("redis://redis", decode_responses=True)
