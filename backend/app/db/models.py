from app.db.database import Base
from sqlalchemy import JSON
from sqlalchemy import String
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql.schema import Column
from sqlalchemy.sql.sqltypes import Date
from sqlalchemy.sql.sqltypes import Float


class Media(Base):
    __tablename__ = "media"

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
    providers = Column(JSON, nullable=True)
