#!/bin/sh
set -e

if [ -f "/run/secrets/ftp_password" ]; then
    FTP_PASSWORD=$(cat /run/secrets/ftp_password)
fi

# Ensure the shared volume workspace directory exists
mkdir -p /var/www/html

# Create the user without a password if they don't exist yet
if ! id "$FTP_USER" >/dev/null 2>&1; then
    adduser -D "$FTP_USER"
fi

# Set the password securely from your environment variables
echo "$FTP_USER:$FTP_PASSWORD" | chpasswd

# Assign directory ownership so the new user can write to the volume
chown -R "$FTP_USER:$FTP_USER" /var/www/html

# Whitelist the user inside the vsftpd allowed accounts file
if ! grep -q "^$FTP_USER$" /etc/vsftpd.userlist; then
    echo "$FTP_USER" >> /etc/vsftpd.userlist
fi

# Execute the CMD passed from the Dockerfile
exec "$@"