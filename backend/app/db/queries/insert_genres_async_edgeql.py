# AUTOGENERATED FROM 'backend/app/db/queries/insert_genres.edgeql' WITH:
#     $ edgedb-py -P 5656 --tls-security insecure --user edgedb --password secret
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
class InsertGenresResult(NoPydanticValidation):
    id: uuid.UUID


async def insert_genres(
    executor: edgedb.AsyncIOExecutor,
    *,
    data: str,
) -> list[InsertGenresResult]:
    return await executor.query(
        """\
        with
          raw_data := <json>$data,
        for item in json_array_unpack(raw_data) union (
          insert Genre { label := <str>item['label'], value := <str>item['value'] }
          unless conflict
        )\
        """,
        data=data,
    )
