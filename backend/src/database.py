from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from helpers import PSQL_USER, PSQL_PWD

SQLALCHEMY_DATABASE_URL = f'postgresql://{PSQL_USER}:{PSQL_PWD}@db:5432/placeholder'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    except:
        db.close()
