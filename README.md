# PLACEHOLDER

## First time setup
Here's how to get the application up and running

### Prerequisites
* Got Git installed
* Got Docker installed

1. Clone the repo `git clone git@gitlab.com:AndreasPB/PLACEHOLDER.git`
2. Add a .env file with `TMDB_API_KEY`
3. Build the container `docker-compose up --build`  
4. Go to http://localhost:1337/

## CLI
To use the cronjob use the following in the terminal:  
`docker-compose exec backend python3 cron.py <method-name> <parameter>`

So as an example to update the media list with 500 pages you would do the following:  
`docker-compose exec backend python3 cron.py update-media 500`

To get help with the commands you can type:  
`docker-compose exec backend python3 cron.py --help`

## Tips & tricks
Some things that might make life easier

### Git
* Make a pushf alias for `git push --force-with-lease`, since writing it all out gets annoying  
`git config --global alias.pushf push --force-with-lease`

### Docker
* You only have to add `--build` the first time, or when you make changes to the docker setup
* Add `-d` to `docker-compose up -d` to detach the logs from the terminal

### Frontend setup guide
https://github.com/sveltejs/template/blob/master/README.md