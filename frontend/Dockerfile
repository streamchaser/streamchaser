# Our Node base image
FROM node:16-alpine

# Change our current working directory
WORKDIR /usr/src/app

# Copy all local files into the image
COPY . .

# install node_modules
RUN npm install

WORKDIR /usr/src/app

# Expose port 3000 for the SvelteKit app and 24678 for Vite's HMR
EXPOSE 3000
EXPOSE 24678

# TODO: Make the file multi-stage #134
# Run the application for development
CMD ["npm", "run", "dev", "--host", "0.0.0.0"]

# Build the application for production and start the server
# RUN npm run build
# CMD ["node", "./build"]
