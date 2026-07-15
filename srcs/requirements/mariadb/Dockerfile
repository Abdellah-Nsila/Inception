FROM alpine:3.23

RUN apk update && apk add --no-cache mariadb mariadb-client

COPY ./conf/mariadb-server.cnf /etc/my.cnf.d/mariadb-server.cnf

COPY ./tools/mariadb_start.sh /usr/local/bin/mariadb_start.sh

RUN chmod +x /usr/local/bin/mariadb_start.sh

EXPOSE 3306

ENTRYPOINT [ "/usr/local/bin/mariadb_start.sh" ]

CMD [ "mariadbd", "--user=mysql" ]
