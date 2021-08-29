from sqlalchemy import String, Integer, JSON
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.schema import Column

from database import Base


class Media(Base):
    __tablename__ = 'media'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=True)
    original_title = Column(String, nullable=True)
    overview = Column(String, nullable=True)
    release_date = Column(String, nullable=True)
    genres = Column(postgresql.ARRAY(String), nullable=True)
    poster_path = Column(String, nullable=True)
    providers = Column(postgresql.ARRAY(JSON), nullable=True)


class Genre(Base):
    __tablename__ = 'genres'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
