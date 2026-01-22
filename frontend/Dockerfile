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

# Create nginx config with API proxy (SSL enabled)
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass API_URL_PLACEHOLDER;
        proxy_http_version 1.1;
        proxy_ssl_server_name on;
        proxy_ssl_verify off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $proxy_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

EXPOSE 80

# Replace placeholder with actual API_URL at runtime, then start nginx
CMD ["/bin/sh", "-c", "sed -i \"s|API_URL_PLACEHOLDER|${API_URL}|g\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
