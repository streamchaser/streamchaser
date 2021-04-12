FROM python:3.9

COPY ./app /app/app
COPY ./requirements.txt /app

WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 1337

CMD [ "uvicorn", "app.main:app", "--host=0.0.0.0", \
      "--port=1337", "--reload" ]