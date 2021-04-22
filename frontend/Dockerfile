# Use Node.js 14, name this stage 'frontend'
FROM node:14

# Copy the rest of the files for the frontend
COPY rollup.config.js .
COPY . /app/frontend

# Our working directory within the image
WORKDIR /app/frontend

# Copy package and lock files then install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

EXPOSE 5000
ENV HOST=0.0.0.0

# Build - this'll output files to /build/wwwroot
CMD [ "npm", "run", "dev" ]