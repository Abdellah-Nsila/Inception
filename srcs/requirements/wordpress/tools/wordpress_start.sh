#!/bin/sh

set -e

# Read secrets into variables if the secret files exist
if [ -f "/run/secrets/db_password" ]; then
    MYSQL_PASSWORD=$(cat /run/secrets/db_password)
fi

if [ -f "/run/secrets/wp_admin_password" ]; then
    WP_ADMIN_PASSWORD=$(cat /run/secrets/wp_admin_password)
fi

if [ -f "/run/secrets/wp_user_password" ]; then
    WP_PASSWORD=$(cat /run/secrets/wp_user_password)
fi

if [ ! -f "wp-config.php" 	]; then

	echo "WordPress is not installed. Initiating installation..."

	# A. Download WordPress core files
    # Note: --allow-root is mandatory because WP-CLI blocks root execution by default
    wp core download --allow-root

	# B. Generate the wp-config.php file
	wp config create \
		--dbname="${MYSQL_DATABASE}" \
		--dbuser="${MYSQL_USER}" \
		--dbpass="${MYSQL_PASSWORD}" \
		--dbhost=mariadb \
		--allow-root

    # Inject Redis configuration into wp-config.php at runtime
    wp config set WP_REDIS_HOST redis --allow-root
    wp config set WP_REDIS_PORT 6379 --raw --allow-root

	# C. Install WordPress and configure the administrator profile
	wp core install \
		--url="${DOMAIN_NAME}" \
		--title="${WP_TITLE}" \
        --admin_user="${WP_ADMIN_USER}" \
        --admin_password="${WP_ADMIN_PASSWORD}" \
        --admin_email="${WP_ADMIN_EMAIL}" \
        --skip-email \
        --allow-root

	# D. Create the mandatory second user (non-admin)
    wp user create \
        "${WP_USER}" \
        "${WP_EMAIL}" \
        --user_pass="${WP_PASSWORD}" \
        --role=author \
        --allow-root

    # Install redis plugin
    wp plugin install redis-cache --activate --allow-root
    wp redis enable --allow-root

	# chown -R nobody:nobody /var/www/html

	echo "WordPress installation and configuration completed successfully!"
else
    echo "WordPress is already configured. Skipping installation steps."

fi

# 3. Start PHP-FPM 8.3 in the foreground to keep the container running
echo "Starting PHP-FPM..."
exec "$@"