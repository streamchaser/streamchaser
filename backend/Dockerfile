FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY . /app/backend

WORKDIR /app/backend/app

RUN pip install -r ../requirements.txt

EXPOSE 1337

# TODO: Should be done without this when deploying
# The Tiangolo image got it's own way of doing it build in
CMD [ "uvicorn", "main:app", "--host=0.0.0.0", \
      "--port=1337", "--reload" ]
