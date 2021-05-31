from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from api_helpers import PSQL_USER, PSQL_PWD

SQLALCHEMY_DATABASE_URL = f'postgresql://{PSQL_USER}:{PSQL_PWD}@db:5432/streamchaser'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        print(f'Error in {__name__}: {e}')
        db.close()
