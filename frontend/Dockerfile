### BASE ###
FROM node:16-alpine as base

# Install git
RUN apk add --no-cache git

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

### DEV ###
FROM base as dev

CMD yarn dev --host

### PROD ###
FROM base as prod

RUN yarn build

CMD node ./build/
