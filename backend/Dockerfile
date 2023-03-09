ARG APP_ENVIRONMENT=dev


FROM python:3.11 as base

WORKDIR /app

RUN pip install poetry --no-cache-dir
COPY pyproject.toml poetry.lock* /app/

EXPOSE 80


FROM base as prod
RUN echo "Starting backend as production" \
    && poetry export -f requirements.txt --output requirements.txt --without-hashes \
    && pip install --no-cache-dir -r requirements.txt

# '-' after --access-logfile means to log to stdout
CMD gunicorn app.main:app --forwarded-allow-ips="*" --access-logfile - -k uvicorn.workers.UvicornWorker -b :80


FROM base as dev
RUN echo "Starting backend as development" \
    && poetry export --with dev -f requirements.txt --output requirements.txt --without-hashes \
    && pip install --no-cache-dir -r requirements.txt
CMD uvicorn app.main:app --host 0.0.0.0 --port 80 --reload
