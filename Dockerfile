#
# 🏡 Production Build
#
FROM node:22-slim AS build

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Copy source files
COPY ./frontend .

#Copy ragna-sdk
COPY ./ragna-sdk ./ragna-sdk

# Install dependencies
RUN npm i

# Build the app
RUN npm run build-prod

#
# 🚀 Production Server
#
FROM nginx:alpine

ENV DISABLE_IPV6=true
# ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

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

# Create www-data user and group if they don't exist
RUN getent group www-data || addgroup -S www-data && \
    getent passwd www-data || adduser -D -H -u 1000 -s /bin/sh -G www-data www-data

# Ensure nginx directories have proper ownership
RUN mkdir -p /var/cache/nginx && \
    mkdir -p /var/run/nginx && \
    chown -R www-data:www-data /var/cache/nginx /var/run/nginx /usr/share/nginx

# Copy built assets from build stage and set www-data as owner
COPY --from=build --chown=www-data:www-data app/dist /usr/share/nginx/html

# Copy nginx config
COPY --from=build --chown=root:root /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=root:root /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=root:root /app/nginx/security.conf /etc/nginx/security/security.conf

# set user to www-data
# USER www-data

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

#nginx -g daemon off
