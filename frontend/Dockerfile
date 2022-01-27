ARG APP_ENV=dev

## BASE ###
FROM node:16-alpine as base

# Change our current working directory
WORKDIR /usr/src/app

# Copy all local files into the image
COPY . .

# Install dependencies
RUN npm install

WORKDIR /usr/src/app

# Expose port 3000 for the SvelteKit app and 24678 for Vite's HMR
EXPOSE 3000
EXPOSE 24678


### DEV ###
FROM base as dev

# Run the application for development
RUN echo "Starting the frontend as development"
CMD ["npm", "run", "dev", "--host", "0.0.0.0"]


### PROD ###
FROM base as prod

# Build the application for production and start the server
RUN echo "Starting the frontend as production" && npm run build
CMD ["node", "./build"]
