FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9-slim

RUN pip install poetry --no-cache-dir

COPY . /app

WORKDIR /app/app

RUN poetry config virtualenvs.create false \
  && poetry install --no-interaction --no-ansi
