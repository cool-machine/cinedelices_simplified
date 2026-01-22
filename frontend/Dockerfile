# Frontend Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Install CA certificates for SSL proxy
RUN apk add --no-cache ca-certificates

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

# Replace placeholder with actual API_URL at runtime, then start nginx
CMD ["/bin/sh", "-c", "sed 's|API_URL_PLACEHOLDER|'\"$API_URL\"'|g' /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
