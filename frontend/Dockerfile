### BASE ###
FROM oven/bun:1.0 as base

# Install git
# RUN apk add --no-cache git

WORKDIR /app

# COPY package.json bun.lockb ./
COPY . .
# RUN yarn --frozen-lockfile && yarn cache clean
RUN bun install


### PROD ###
FROM base as prod

RUN bun run build

CMD bun ./build/index.js

### DEV ###
FROM base as dev

RUN echo "Starting the frontend as development"
CMD bun dev
