#!/bin/sh

# 1. Setup system directories
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld
chown -R mysql:mysql /var/lib/mysql

# 2. ONLY install the default system tables (Leave the rest commented out)
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing blank system tables..."
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql --skip-test-db > /dev/null
fi

# 3. Boot the engine safely
echo "Starting raw MariaDB engine..."
exec "$@"
