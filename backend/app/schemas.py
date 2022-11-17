from pydantic import BaseModel


class Media(BaseModel):
    id: str
    type: str
    title: str | None
    original_title: str
    overview: str | None
    release_date: str | None
    genres: list[str | None]
    poster_path: str | None
    popularity: int | None
    provider_names: list[str] | None
    supported_provider_countries: list[str]
    providers: dict[str, dict[str, list[dict]]]

    class Config:
        # Makes use of database syntax "media.id" instead of "media['id']
        orm_mode = True


class Movie(BaseModel):
    id: int
    title: str
    release_date: str
    overview: str
    genres: list[str] | None
    imdb_id: str | None
    runtime: int | None
    flatrate_providers: list[dict] | None
    free_providers: list[dict] | None
    recommendations: list[dict]
    poster_path: str | None
    popularity: int
    backdrop_path: str | None
    cast: list[dict]


class TV(BaseModel):
    id: int
    name: str
    first_air_date: str | None
    overview: str
    imdb_id: str | None
    genres: list[str] | None
    episode_run_time: list[int]
    flatrate_providers: list[dict] | None
    free_providers: list[dict] | None
    recommendations: list[dict] | None
    poster_path: str | None
    popularity: int
    number_of_seasons: int
    seasons: list[dict]
    backdrop_path: str | None
    cast: list[dict]


class Person(BaseModel):
    id: int
    name: str
    imdb_id: str | None
    birthdate: str | None
    deathday: str | None
    biography: str
    place_of_birth: str | None
    also_known_as: list[str] | None
    profile_path: str | None
    movie_credits: list[dict] | None
    tv_credits: list[dict] | None
    gender: int
