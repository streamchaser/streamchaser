import time

from app.config import Environment
from app.config import get_settings
from app.db.cache import redis
from app.db.search import search_client_config
from app.routers import countries
from app.routers import country
from app.routers import genres
from app.routers import image
from app.routers import media
from app.routers import movie
from app.routers import person
from app.routers import providers
from app.routers import search
from app.routers import stats
from app.routers import tv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from requests.sessions import Request
from starlette_context import middleware
from starlette_context import plugins


app = FastAPI()


@app.on_event("startup")
async def init_db():
    if get_settings().app_environment == Environment.PRODUCTION:
        # Only done in production because of development reloading
        search_client_config()


@app.on_event("shutdown")
async def close_db():
    await redis.close()


streamchaser_url = get_settings().streamchaser_url

app.add_middleware(
    middleware.ContextMiddleware,
    plugins=(plugins.ForwardedForPlugin(),),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Sets X-Process-Time with time taken for each call
if get_settings().app_environment == Environment.DEVELOPMENT:

    @app.middleware("http")
    async def add_process_time_header(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response


app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(media.router)
app.include_router(providers.router)
app.include_router(genres.router)
app.include_router(tv.router)
app.include_router(movie.router)
app.include_router(search.router)
app.include_router(person.router)
app.include_router(country.router)
app.include_router(image.router)
app.include_router(stats.router)
app.include_router(countries.router)


@app.get("/")
async def root() -> dict | RedirectResponse:
    """Home page"""
    if get_settings().app_environment == Environment.PRODUCTION:
        return {
            "data": "Welcome to the API - Go to /docs for the Swagger documentation"
        }
    return RedirectResponse(url="/docs")
