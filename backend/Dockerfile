FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY . /app

WORKDIR /app/app

RUN pip install --no-cache-dir -r ../requirements.txt
