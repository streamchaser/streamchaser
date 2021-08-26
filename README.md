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
* [Routify](https://github.com/roxiness/routify)
* [PostgreSQL](https://github.com/postgres/postgres) 
* [Docker](https://github.com/docker)
* [Materialfy](https://github.com/TheComputerM/svelte-materialify)

Authors 👷:
* [AndreasPB](https://github.com/AndreasPB)
* [Pankai222](https://github.com/Pankai222)
* [nullxDEADBEEF](https://github.com/nullxDEADBEEF)
* [Primdahl26](https://github.com/Primdahl26)


## First time setup
Here's how to get the application up and running

### Prerequisites
* Got Git installed
* Got Docker installed

1. Clone the repo `git clone https://github.com/AndreasPB/streamchaser.git`
2. Build the container `docker-compose up --build -d`  
3. Run `docker-compose exec backend python3 cron.py full-setup <total_pages>`
4. Go to http://localhost:3000/ and search

## CLI
To use the cronjob use the following in the terminal:  
`docker-compose exec backend python3 cron.py <command> <parameter>`

List of commands:
* `add-providers` - Adds/updates providers on your existing media
* `fetch-media` - Fetches trending media and adds to DB
* `full-setup` - The complete setup
* `index-meilisearch` - Forces meilisearch to re-index
* `remove-all-media` - Empties postgres for media
* `remove-blacklisted-from-search` - Removes all blacklisted IDs
* `remove-non-ascii-media` - Removes all non-ascii titles

So as an example to update the media list with 500 pages you would do the following:  
`docker-compose exec backend python3 cron.py update-media 500`

After updating the database you need to index MeiliSearch:  
`docker-compose exec backend python3 cron.py index-meilisearch`

*To do a full setup use the following command:*  
`docker-compose exec backend python3 cron.py full-setup <total_pages>`  
Optional: Add `--no-remove-ascii` to the end if you want to keep non-ascii titles. 

This will fetch media for the number of pages, and remove non ascii characters if False flag is not added.  This also indexes MeiliSearch.

To drop the media database:  
`docker-compose exec backend python3 cron.py remove-all-media`

To get help with the commands type:  
`docker-compose exec backend python3 cron.py --help`  
or  
`docker-compose exec backend python3 cron.py <command> --help`


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
