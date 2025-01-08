# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json from the src folder
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application files from the src folder
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
