#!/bin/sh

mkdir /etc/nginx/ssl

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/nginx/ssl/inception.key \
	-out /etc/nginx/ssl/inception.crt \
	-subj "/C=MA/L=BenGuerir/O=1337/CN=abnsila.42.fr"

exec nginx -g "daemon off;"