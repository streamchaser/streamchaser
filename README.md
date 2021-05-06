# PLACEHOLDER

## First time setup
Here's how to get the application up and running

### Prerequisites
* Got Git installed
* Got Docker installed

1. Clone the repo `git clone git@gitlab.com:AndreasPB/PLACEHOLDER.git`
2. Add a .env file in backend with `TMDB_API_KEY=<key>`, `POSTGRES_PASSWORD=<password>` and `POSTGRES_USERNAME=<username>`
3. Build the container `docker-compose up --build`  
4. Run `docker-compose exec backend python3 cron.py update-media <total pages>`
5. Go to http://localhost:5000/ and search

## CLI
To use the cronjob use the following in the terminal:  
`docker-compose exec backend python3 cron.py <method-name> <parameter>`

So as an example to update the media list with 500 pages you would do the following:  
`docker-compose exec backend python3 cron.py update-media 500`

To get help with the commands you can type:  
`docker-compose exec backend python3 cron.py --help`

## Postgres CLI
### How to drop a table
Make sure the db container is running and enter PSQL
* `docker ps`
* `docker-compose exec db psql -U postgres`

Then from PSQL
* `\c placeholder`
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

### Frontend setup guide
https://github.com/sveltejs/template/blob/master/README.md
