FROM alpine:3.19

# Install explicit PHP 8.3 packages
RUN apk update && apk add --no-cache \
    php83 \
    php83-mysqli \
    php83-pdo_mysql \
    php83-session \
    wget

WORKDIR /var/www/html

# Download Adminer
RUN wget https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php -O index.php

EXPOSE 8080

# Call php83 directly to run the built-in server
CMD ["php83", "-S", "0.0.0.0:8080", "-t", "/var/www/html"]
