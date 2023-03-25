# I've gathered some of the most used commands in Streamchaser for ease of use

full-setup popularity chunk_size="25000":
  docker-compose exec backend python3 cli.py full-setup --chunk-size {{chunk_size}} --popularity {{popularity}}

migrate:
  edgedb --tls-security=insecure -P 5656 --user edgedb --password migration create && edgedb --tls-security=insecure -P 5656 --user edgedb --password migrate

db-ui:
  @echo https://localhost:5656/ui - Login information is on Discord

generate-edgedb-python:
  cd backend/ && poetry run edgedb-py -P 5656 --tls-security insecure --user edgedb --password secret && cd ../

cli command="--help":
  docker-compose exec backend python3 cli.py {{command}}

generate password:
  cd backend/ && poetry run edgedb-py -P 5656 --tls-security insecure --user edgedb --password {{password}} --file app/db/queries/generated.py && black app/db/queries/generated.py && cd ../

shell:
  cd backend/ && poetry shell && cd ../
