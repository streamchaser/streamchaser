# Our Node base image
FROM node:16-alpine

# Change our current working directory
WORKDIR /usr/src/app

# Copy all local files into the image
COPY . .

# install node_modules
RUN npm install

WORKDIR /usr/src/app

# Build the application for production
RUN npm run build

# Expose port 3000 for the SvelteKit app and 24678 for Vite's HMR
EXPOSE 3000
EXPOSE 24678

# Start the svelte build result
CMD ["node", "./build"]
