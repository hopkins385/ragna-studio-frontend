# Build stage
FROM node:22-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build-prod

# Production stage
FROM nginx:alpine

# Install build dependencies
RUN apk add --no-cache \
    gcc \
    libc-dev \
    make \
    openssl-dev \
    pcre-dev \
    zlib-dev \
    linux-headers \
    curl \
    gnupg \
    git

# Get nginx source
RUN curl -fSL https://nginx.org/download/nginx-$(nginx -v 2>&1 | sed 's/^nginx version: nginx\///').tar.gz -o nginx.tar.gz && \
    tar -zxf nginx.tar.gz && \
    rm nginx.tar.gz

# Clone and build security headers module
RUN git clone https://github.com/GetPageSpeed/ngx_security_headers && \
    cd nginx-* && \
    ./configure --with-compat --add-dynamic-module=../ngx_security_headers && \
    make modules && \
    mkdir -p /etc/nginx/modules && \
    cp objs/ngx_http_security_headers_module.so /etc/nginx/modules/ && \
    cd .. && \
    rm -rf nginx-* ngx_security_headers

# Clean up build dependencies
RUN apk del gcc libc-dev make openssl-dev pcre-dev zlib-dev linux-headers curl gnupg git

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
