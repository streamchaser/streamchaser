# I've gathered some of the most used commands in Streamchaser for ease of use

full-setup popularity:
  docker-compose exec backend python3 cli.py full-setup --first-time --popularity {{popularity}}

migrate:
  edgedb --tls-security=insecure -P 5656 migrate

migration-create:
  edgedb --tls-security=insecure -P 5656 migration create

db-ui:
  @echo https://localhost:5656/ui - Login information is on Discord

generate-edgedb-python:
  cd backend/ && poetry run edgedb-py -P 5656 --tls-security insecure --user edgedb --password secret && cd ../
