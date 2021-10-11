from enum import Enum
from functools import lru_cache
from pathlib import Path
from typing import List
from typing import Optional

from pydantic import BaseSettings


class Environment(str, Enum):
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"


class Settings(BaseSettings):
    """
    These settings can be overwritten by environment variables
    The environement variable name is the upper-cased version of the variable name below
    E.g. TMDB_KEY == tmdb_key
    """

    # Misc streamchaser settings
    environment: Environment = Environment.PRODUCTION
    streamchaser_url: str = "localhost"
    tmdb_key: Optional[str] = "no key"
    tmdb_url: str = "https://api.themoviedb.org/3/"
    supported_country_codes: List[str] = ["DK", "GB", "DE", "SE", "US"]

    # Postgres setting
    psql_user: str = "postgres"
    psql_pwd: str = "postgres"

    class Config:
        env_file = Path("../.env")


@lru_cache
def get_settings() -> Settings:
    return Settings()
