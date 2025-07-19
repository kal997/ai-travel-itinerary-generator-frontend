# Multi-stage build for production
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app for production
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration for SPA
COPY nginx.conf /etc/nginx/nginx.conf

# Cloud Run uses PORT environment variable
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]