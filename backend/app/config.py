from enum import Enum
from functools import lru_cache

from pydantic import BaseSettings


class Environment(str, Enum):
    DEVELOPMENT = "dev"
    TESTING = "test"
    PRODUCTION = "prod"


class Settings(BaseSettings):
    """
    These settings can be overwritten by environment variables
    The environement variable name is the upper-cased version of the variable name below
    E.g. TMDB_KEY == tmdb_key
    """

    # Misc streamchaser settings
    app_environment: Environment = Environment.DEVELOPMENT
    fill_cache_on_starup: bool = True
    streamchaser_url: str = "localhost"
    tmdb_key: str = "no key"
    tmdb_url: str = "https://api.themoviedb.org/3/"
    supported_country_codes: list[str] = ["DK", "GB", "DE", "SE", "US"]

    # Postgres setting
    psql_user: str = "postgres"
    psql_pwd: str = "postgres"


@lru_cache
def get_settings() -> Settings:
    return Settings()
