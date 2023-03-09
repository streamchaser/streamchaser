# AUTOGENERATED FROM 'backend/app/db/queries/get_genres.edgeql' WITH:
#     $ edgedb-py -P 5656 --tls-security insecure
from __future__ import annotations

import dataclasses
import uuid

import edgedb


class NoPydanticValidation:
    @classmethod
    def __get_validators__(cls):
        from pydantic.dataclasses import dataclass as pydantic_dataclass

        pydantic_dataclass(cls)
        cls.__pydantic_model__.__get_validators__ = lambda: []
        return []


@dataclasses.dataclass
class GetGenresResult(NoPydanticValidation):
    id: uuid.UUID
    label: str
    value: str


async def get_genres(
    executor: edgedb.AsyncIOExecutor,
) -> list[GetGenresResult]:
    return await executor.query(
        """\
        select Genre {
          label,
          value
        }\
        """,
    )
