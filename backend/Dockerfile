ARG APP_ENVIRONMENT=dev


FROM --platform=linux/amd64 python:3.9-slim as base

WORKDIR /app

RUN pip install poetry --no-cache-dir
COPY pyproject.toml poetry.lock* /app/

EXPOSE 80


FROM base as prod
RUN echo "Starting backend as production" \
    && poetry export -f requirements.txt --output requirements.txt --without-hashes \
    && pip install --no-cache-dir -r requirements.txt
CMD gunicorn app.main:app -k uvicorn.workers.UvicornWorker -b :80


FROM base as dev
RUN echo "Starting backend as development" \
    && poetry export --dev -f requirements.txt --output requirements.txt --without-hashes \
    && pip install --no-cache-dir -r requirements.txt
CMD uvicorn app.main:app --host 0.0.0.0 --port 80 --reload
