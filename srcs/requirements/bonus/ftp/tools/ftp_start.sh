#!/bin/sh
set -e

if [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
    echo "ERROR: FTP_USER or FTP_PASS environment variables are missing."
    exit 1
fi

if ! id "$FTP_USER" >/dev/null 2>&1; then
    echo "Creating FTP user: $FTP_USER"
    useradd -m -s /bin/sh "$FTP_USER"
    echo "$FTP_USER:$FTP_PASS" | chpasswd
    usermod -d /var/www/html "$FTP_USER"
fi

# Ensure the shared WordPress volume folders have valid access levels
mkdir -p /var/www/html
chown -R $FTP_USER:$FTP_USER /var/www/html

# Crucial Fix: Create the empty jail directory required by vsftpd on Alpine
mkdir -p /var/run/vsftpd/empty

echo "Starting vsftpd server..."
exec "$@"