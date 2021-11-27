import asyncio
from typing import Dict

from app.config import get_settings
from app.db import models
from app.db.database import engine
from app.routers import genres
from app.routers import media
from app.routers import movie
from app.routers import person
from app.routers import providers
from app.routers import search
from app.routers import tv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


@app.on_event("startup")
async def init_db():
    try:
        models.Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(e)
        print("Will try to connect to the database again in 2 seconds...")
        asyncio.sleep(2)
        models.Base.metadata.create_all(bind=engine)


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
