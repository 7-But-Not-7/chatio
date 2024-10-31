# Frontend Docker Directory

# 1. Build the frontend
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the frontend
RUN npm run build

# 2. Serve the frontend
FROM nginx:alpine

# Copy the build files to the nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]