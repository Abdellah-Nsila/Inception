FROM alpine:3.23

RUN apk update && apk upgrade && apk add --no-cache \
    php83 \
    php83-fpm \
    php83-mysqli \
    php83-json \
    php83-openssl \
    php83-curl \
    php83-zlib \
    php83-xml \
    php83-phar \
    php83-intl \
    php83-dom \
    php83-xmlreader \
    php83-ctype \
    php83-session \
    php83-mbstring \
    mariadb-client \
    curl

# Install WP-CLI (WordPress Command Line Interface)
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp \
	&& ln -s /usr/bin/php83 /usr/bin/php

COPY ./conf/www.conf /etc/php83/php-fpm.d/www.conf

COPY ./tools/wordpress_start.sh /usr/local/bin/wordpress_start.sh

RUN chmod +x /usr/local/bin/wordpress_start.sh

WORKDIR /var/www/html

EXPOSE 9000

ENTRYPOINT [ "/usr/local/bin/wordpress_start.sh" ]

CMD [ "php-fpm83", "-F" ]
