### BASE ###
FROM node:16-alpine as base

# Install git
RUN apk add --no-cache git

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile && yarn cache clean

COPY . .

### PROD ###
FROM base as prod

RUN yarn build

CMD node ./build/

### DEV ###
FROM base as dev

RUN echo "Starting the frontend as development"
CMD yarn dev --host
