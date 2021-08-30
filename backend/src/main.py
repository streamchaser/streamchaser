from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models

from database import engine
from routers import media, providers, genres, movie, tv, search


models.Base.metadata.create_all(bind=engine)


app = FastAPI()


origins = [
    "http://localhost:8080",
    "http://localhost:5000",  # TODO: Remove when old_frontend is deleted
    "http://localhost:3000",
    "http://localhost",
    "https://localhost",
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


@app.get("/")
async def root() -> Dict:
    """Home page"""
    return {"data": "Welcome to the API - Go to /docs for a better view"}
