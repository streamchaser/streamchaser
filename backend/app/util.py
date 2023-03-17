import asyncio
from functools import wraps
from typing import Generator
from typing import Tuple

import jwt
from app.config import get_settings
from app.models import DecodedJWT
from fastapi import HTTPException


def chunkify(lst: list, size: int) -> Tuple[Generator[list, None, None], int]:
    """Chunks lst into unique subsets of length chunk_size"""
    chunks = 0
    for i in range(len(lst)):
        if not (i % size):
            chunks += 1
    return (lst[i::chunks] for i in range(chunks)), chunks


def coroutine(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))

    return wrapper


# FIXME: Idk how to return proper HTTPException's to the frontend
def decode_jwt(encoded_jwt: str) -> DecodedJWT:
    try:
        decoded = jwt.decode(
            encoded_jwt, get_settings().auth_secret, algorithms=["HS256"]
        )
    except Exception as e:
        raise HTTPException(418, detail=e)

    return DecodedJWT(**decoded)
