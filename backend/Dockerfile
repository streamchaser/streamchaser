ARG APP_ENV=dev


FROM python:3.9-slim as base

WORKDIR /app

RUN pip install poetry --no-cache-dir
COPY pyproject.toml poetry.lock* /app/
# export requirements since we dont need poetry in our final build stage
RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 80

FROM base as dev
RUN echo "Starting backend as development"
CMD uvicorn app.main:app --host 0.0.0.0 --port 80 --reload

FROM base as prod
RUN echo "Starting backend as production"
CMD gunicorn app.main:app -k uvicorn.workers.UvicornWorker -b :80
