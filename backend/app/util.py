import asyncio
from functools import wraps
from typing import Generator, Tuple

from fastapi import HTTPException
from google.auth.exceptions import InvalidValue, MalformedError
from google.auth.transport import requests
from google.oauth2 import id_token
from requests import status_codes

from app.config import get_settings
from app.models import GoogleAuth


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


def decode_jwt(encoded_jwt: str):
    try:
        idinfo = id_token.verify_oauth2_token(
            encoded_jwt, requests.Request(), get_settings().google_client_id
        )
        return GoogleAuth(**idinfo)

    # Error for malformed jwt's
    except MalformedError:
        raise HTTPException(status_code=498, detail="Could not parse JWT")

    # Error for f.x expiration
    except InvalidValue as e:
        # Here we would refresh the token
        raise HTTPException(status_code=498, detail=str(e))
