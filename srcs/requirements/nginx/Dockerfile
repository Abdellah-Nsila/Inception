FROM alpine:3.23

RUN apk add --no-cache nginx openssl

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

COPY ./tools/nginx_start.sh /usr/local/bin/nginx_start.sh

RUN chmod +x /usr/local/bin/nginx_start.sh

EXPOSE 443

ENTRYPOINT [ "/usr/local/bin/nginx_start.sh" ]
