# Use the official Node.js 18 base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install production dependencies
RUN npm ci

# Copy the rest of the application code into the container
COPY . .

# Build the Next.js application
RUN npm run build

# Set the environment variable for the port
ENV PORT=3000

# Expose the port the app runs on
EXPOSE $PORT

# Start the Next.js production server
CMD ["npm", "start"]