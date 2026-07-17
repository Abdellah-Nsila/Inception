FROM alpine:3.23

RUN apk add --no-cache nginx openssl

ARG DOMAIN_NAME=abnsila.42.fr

RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/inception.key \
    -out /etc/nginx/ssl/inception.crt \
    -subj "/C=MA/L=BenGuerir/O=1337/CN=${DOMAIN_NAME}"

COPY ./conf/nginx.conf /etc/nginx/http.d/nginx.conf

EXPOSE 443

CMD [ "nginx", "-g", "daemon off;" ]