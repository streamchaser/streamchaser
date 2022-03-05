ARG APP_ENV=dev

## BASE ###
FROM node:16-alpine as base

# Install git
RUN apk add --no-cache git

# Change our current working directory
WORKDIR /usr/src/app

# Copy over `package.json` and lock files to optimize the build process
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install && yarn cache clean

# Copy all local files into the image
COPY . .

# Expose port 3000 for the SvelteKit app and 24678 for Vite's HMR
EXPOSE 3000
EXPOSE 24678

### DEV ###
FROM base as dev

# Run the application for development
RUN echo "Starting the frontend as development"
CMD yarn run dev


### PROD ###
FROM base as prod

# Build the application for production and start the server
RUN yarn run build
CMD node ./build
