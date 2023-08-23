# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install application dependencies
RUN npm install --omit-dev

# Copy the rest of the application code to the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Specify the command to run when the container starts
CMD [ "node", "dist/server.js" ]
