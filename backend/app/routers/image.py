import httpx
from fastapi import APIRouter
from starlette.background import BackgroundTask
from starlette.responses import StreamingResponse


router = APIRouter(
    prefix="/image",
    tags=["image"],
)

client = httpx.AsyncClient(base_url="https://image.tmdb.org/t/p/")


# TODO: Should cache result
@router.get("/")
async def image_proxy(size: str = "w342", path: str = "/example.jpg"):
    req = client.build_request("GET", f"{size}/{path}")
    r = await client.send(req, stream=True)
    return StreamingResponse(
        r.aiter_raw(), background=BackgroundTask(r.aclose), headers=r.headers
    )
