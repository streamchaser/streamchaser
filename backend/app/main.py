from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.config import get_settings
from backend.app.db import models
from backend.app.db.database import engine
from backend.app.routers import genres
from backend.app.routers import media
from backend.app.routers import movie
from backend.app.routers import person
from backend.app.routers import providers
from backend.app.routers import search
from backend.app.routers import tv


models.Base.metadata.create_all(bind=engine)


app = FastAPI()


streamchaser_url = get_settings().streamchaser_url
origins = [
    f"http://{streamchaser_url}:8080",
    f"https://{streamchaser_url}:8080",
    f"http://{streamchaser_url}",
    f"https://{streamchaser_url}",
    f"http://api.{streamchaser_url}",
    f"https://api.{streamchaser_url}",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(media.router)
app.include_router(providers.router)
app.include_router(genres.router)
app.include_router(tv.router)
app.include_router(movie.router)
app.include_router(search.router)
app.include_router(person.router)


@app.get("/")
async def root() -> Dict:
    """Home page"""
    return {"data": "Welcome to the API - Go to /docs for the Swagger documentation"}
