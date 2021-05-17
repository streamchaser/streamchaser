#FROM nginx
#COPY dist /usr/share/nginx/html
#
#
# Use Node.js 14, name this stage 'frontend'
FROM node:14

# Copy the rest of the files for the frontend
COPY . /app

# Our working directory within the image
WORKDIR /app

# Copy package and lock files then install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm run build

EXPOSE 5000
