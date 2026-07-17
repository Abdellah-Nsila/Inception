#!/bin/sh

# 1. Read secrets into variables before running any checks or bootstrap
if [ -f "/run/secrets/db_root_password" ]; then
    MYSQL_ROOT_PASSWORD=$(cat /run/secrets/db_root_password)
fi

if [ -f "/run/secrets/db_password" ]; then
    MYSQL_PASSWORD=$(cat /run/secrets/db_password)
fi

# 2. Setup system directories
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld
chown -R mysql:mysql /var/lib/mysql

# 3. ONLY install the default system tables
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing blank system tables..."
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql --skip-test-db > /dev/null

    # Defensive check: Validates properly now that variables are pulled from secrets
    if [ -z "$MYSQL_ROOT_PASSWORD" ] || [ -z "$MYSQL_DATABASE" ] || [ -z "$MYSQL_USER" ] || [ -z "$MYSQL_PASSWORD" ]; then
        echo "ERROR: One or more database credentials or variables are empty! Aborting setup."
        exit 1
    fi

    # We use mariadbd --bootstrap to feed SQL statements directly into the engine
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

# 4. Boot the engine safely
echo "Starting raw MariaDB engine..."
exec "$@"