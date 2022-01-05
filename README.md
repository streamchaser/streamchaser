[![CI](https://github.com/streamchaser/streamchaser/actions/workflows/main.yml/badge.svg)](https://github.com/streamchaser/streamchaser/actions/workflows/main.yml)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/streamchaser/streamchaser/master.svg)](https://results.pre-commit.ci/latest/github/streamchaser/streamchaser/master)
[![CodeFactor status](https://www.codefactor.io/repository/github/streamchaser/streamchaser/badge)](https://www.codefactor.io/repository/github/streamchaser/streamchaser)

# 🎬 streamchaser 🎬
Streamchaser seeks to simplify movie, series and documentary search located on streaming services by curating all of the content through a centralized entertainment technology platform.
Streamchaser seeks to solve the issue where it appears, i.e. in front of the TV.
Lastly, Streamchaser is founded on the basis of convenience, which means that no feature,
no profit margin and no personal gains should ever compromise the convenience and ease of use for the customer.

## Credits
Built using:
* [FastAPI](https://github.com/tiangolo/fastapi)
* [MeiliSearch](https://github.com/meilisearch/MeiliSearch)
* [Svelte](https://github.com/sveltejs/svelte)
* [Svelte-kit](https://kit.svelte.dev)
* [PostgreSQL](https://github.com/postgres/postgres)
* [Docker](https://github.com/docker)
* [Tailwind CSS](https://tailwindcss.com)
* [DaisyUI](https://daisyui.com)

Authors 👷:
* [AndreasPB](https://github.com/AndreasPB)
* [Pankai222](https://github.com/Pankai222)
* [nullxDEADBEEF](https://github.com/nullxDEADBEEF)
* [Primdahl26](https://github.com/Primdahl26)


## First time setup
Here's how to get the application up and running for development

### Prerequisites
* Got **Git** installed
* Got **Docker** installed

1. Clone the repo `git clone https://github.com/streamchaser/streamchaser.git`
2. Add `.env` in root, backend and frontend
    * Backend: `TMDB_KEY`
    * Frontend: `VITE_API_PATH`(path of the backend), `VITE_IPINFO_KEY`
3. Build the container `docker-compose up --build -d`
4. Run `docker-compose exec backend python3 cli.py full-setup <popularity>`
5. Go to http://localhost/ and search

## CLI
To use the cronjob use the following in the terminal:
`docker-compose exec backend python3 cli.py <command> <parameter>`

List of commands:
* `fetch-jsongz` Downloads the files that contains all media we iterate over
* `add-data` - Adds/updates the data on the existing media from the DB
* `cleanup-genres` - Fixes genres with spaces for the frontend
* `fetch-media` - Runs `fetch-jsongz` and fetches media from TMDB and adds to the DB
* `full-setup` - The complete setup
* `index-meilisearch` - Forces meilisearch to re-index
* `remove-all-media` - Empties postgres for media
* `remove-and-blacklist` - Removes an element from the databases and blacklists it
* `remove-blacklisted-from-search` - Removes all blacklisted IDs
* `remove-non-ascii-media` - Removes all non-ascii titles

So as an example to update the media list with all media with a popularity over 5:
`docker-compose exec backend python3 cli.py add-data 5`

After updating the database you need to index MeiliSearch:
`docker-compose exec backend python3 cli.py index-meilisearch`

*To do a full setup use the following command:*
`docker-compose exec backend python3 cli.py full-setup <popularity>`
Optional: Add `--remove-ascii` to the end if you want to prune non-ascii titles.

This will fetch media within the popularity limit, and index MeiliSearch.
Popularity defaults to 0, and will fetch all media if that is the case.

To drop the media database:
`docker-compose exec backend python3 cli.py remove-all-media`

To get help with the commands type:
`docker-compose exec backend python3 cli.py --help`
or
`docker-compose exec backend python3 cli.py <command> --help`


## Postgres CLI
### How to drop a table
Make sure the db container is running and enter PSQL
* `docker ps`
* `docker-compose exec db psql -U postgres`

Then from PSQL
* `\c streamchaser`
* `drop table media;`

### Extra commands
* `\l` lists all databases
* `\dt` lists all data tables

## Tips & tricks
Some things that might make life easier

### Git
* Make a pushf alias for `git push --force-with-lease`, since writing it all out gets annoying
`git config --global alias.pushf "push --force-with-lease"`

### Docker
* You only have to add `--build` the first time, or when you make changes to the docker setup
* Add `-d` to `docker-compose up -d` to detach the logs from the terminal

### How to run tests
To run tests locally:
* `docker-compose run backend python -m pytest -v ../`
* `docker-compose exec backend python -m pytest -v ../`
