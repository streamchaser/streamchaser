from sqlalchemy import Integer, String, ForeignKey, ARRAY
from sqlalchemy.sql.schema import Column
from sqlalchemy.orm import relationship

from database import Base


class Media(Base):
    __tablename__ = 'media'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=True)
    original_title = Column(String, nullable=True)
    release_date = Column(String, nullable=True)
    genre_ids = Column(ARRAY(Integer), nullable=True)
    poster_path = Column(String, nullable=True)

    # genres = relationship('Genre', back_populates='owner')


# class Genre(Base):
#     __tablename__ = 'genres'
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, index=True)
#     owner_id = Column(String, ForeignKey('medias.id'))
#
#     owner = relationship('Media', back_populates='genres')
