from app.db.database import Base
from sqlalchemy import Integer
from sqlalchemy import JSON
from sqlalchemy import String
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import Date
from sqlalchemy.sql.sqltypes import Float


class Media(Base):
    __tablename__ = "media"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=True)
    original_title = Column(String, nullable=True)
    overview = Column(String, nullable=True)
    release_date = Column(String, nullable=True)
    genres = Column(postgresql.ARRAY(String), nullable=True)
    poster_path = Column(String, nullable=True)
    popularity = Column(Integer, nullable=True)
    flatrate_providers = Column(postgresql.ARRAY(JSON), nullable=True)
    free_providers = Column(postgresql.ARRAY(JSON), nullable=True)


class NewMedia(Base):
    __tablename__ = "db_media"

    id = Column(String, primary_key=True)
    created_at = Column(Date, nullable=False)
    updated_at = Column(Date, nullable=False)
    title = Column(String, nullable=True)
    original_title = Column(String, nullable=True)
    overview = Column(String, nullable=True)
    release_date = Column(String, nullable=True)
    genres = Column(postgresql.ARRAY(String), nullable=True)
    poster_path = Column(String, nullable=True)
    popularity = Column(Float, nullable=True)
    results = Column(JSON, nullable=True)


class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    value = Column(String, nullable=False)
