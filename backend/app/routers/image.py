import httpx
from app.db.cache import redis
from fastapi import APIRouter
from fastapi.responses import Response


router = APIRouter(
    prefix="/image",
    tags=["image, poster"],
)

client = httpx.AsyncClient(http2=True, base_url="https://image.tmdb.org/t/p/")


@router.get("/")
async def cached_image_proxy(size: str = "w342", path: str = "/example.jpg"):
    headers = {"Cache-Control": "max-age=31536000"}
    if cached_image := (await redis.get(f"image:{size}_{path}")):
        return Response(content=cached_image, media_type="image/jpg", headers=headers)

    res = await client.get(f"{size}/{path}")
    image: bytes = await res.aread()

    await redis.set(f"image:{size}_{path}", image)
    await redis.expire(f"image:{size}_{path}", 60 * 60 * 24)  # 1 day

    return Response(content=image, media_type="image/jpg", headers=headers)
