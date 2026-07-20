FROM alpine:3.23

RUN apk update && apk add --no-cache vsftpd

COPY ./conf/vsftpd.conf /etc/vsftpd/vsftpd.conf

COPY ./tools/ftp_start.sh /usr/local/bin/ftp_start.sh

RUN chmod +x /usr/local/bin/ftp_start.sh

EXPOSE 21 30000-30005

ENTRYPOINT [ "/usr/local/bin/ftp_start.sh" ]

CMD [ "vsftpd", "/etc/vsftpd/vsftpd.conf" ]