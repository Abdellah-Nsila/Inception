#!/bin/sh

# 1. Setup system directories
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld
chown -R mysql:mysql /var/lib/mysql

# 2. ONLY install the default system tables (Leave the rest commented out)
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing blank system tables..."
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql --skip-test-db > /dev/null

	# We use mariadbd --bootstrap to feed SQL statements directly into the engine
    # while the server is offline, using the environment variables from your .env
    mariadbd --user=mysql --bootstrap << EOF
FLUSH PRIVILEGES;

ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
DELETE FROM mysql.user WHERE User='';

FLUSH PRIVILEGES;
EOF

    echo "Database provisioning completed successfully."
fi

# 3. Boot the engine safely
echo "Starting raw MariaDB engine..."
exec "$@"
