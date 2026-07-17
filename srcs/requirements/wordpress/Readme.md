# 📝 WordPress Service Documentation

## 1. The WordPress Dockerfile Breakdown

This file builds a lightweight, highly secure PHP-FPM environment optimized specifically to host and serve WordPress via Alpine Linux.

```dockerfile
FROM alpine:3.23

```

* **What it does:** Sets the official lightweight Alpine Linux v3.23 as our base operating system layer.

```dockerfile
RUN apk update && apk upgrade && apk add --no-cache \
    php83 \
    php83-fpm \
    php83-mysqli \
    php83-json \
    ...
    mariadb-client \
    curl

```

* **What it does:** Updates the package index and upgrades existing OS packages for security. Then, it installs **PHP 8.3**, the **FastCGI Process Manager (`php83-fpm`)**, and all essential extensions WordPress requires to compile code, process images, and establish database sessions.
* **Key Packages:**
* `php83-mysqli`: The mandatory driver allowing PHP to speak with your MariaDB database.
* `mariadb-client`: Installed so that WP-CLI can perform diagnostic tests directly on the database port.
* `--no-cache`: Tells Alpine not to save the installer download files, keeping the image size tiny.



```dockerfile
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp \
    && ln -s /usr/bin/php83 /usr/bin/php

```

* **What it does:** Downloads **WP-CLI** (the WordPress Command Line Interface archive), marks it as executable, and moves it into the global system execution path as `wp`. The final `ln -s` line creates a symlink mapping the generic `php` command to `php83` so WP-CLI executes smoothly.

```dockerfile
RUN echo "memory_limit=512M" > /etc/php83/conf.d/memory-limit.ini

```

* **What it does:** Injects a custom configuration rule raising PHP's runtime RAM limit to 512MB, preventing heavy WordPress workflows or plugins from throwing out-of-memory errors.

```dockerfile
COPY ./conf/www.conf /etc/php83/php-fpm.d/www.conf
COPY ./tools/wordpress_start.sh /usr/local/bin/wordpress_start.sh
RUN chmod +x /usr/local/bin/wordpress_start.sh

```

* **What it does:** Copies over your custom PHP-FPM pool settings and your automated initialization shell script, marking the script with proper execution privileges.

```dockerfile
WORKDIR /var/www/html
EXPOSE 9000

```

* **What it does:** Changes the active working directory context to the webroot where WordPress lives and documents that the container listens internally on FastCGI port `9000`.

```dockerfile
ENTRYPOINT [ "/usr/local/bin/wordpress_start.sh" ]
CMD [ "php-fpm83", "-F" ]

```

* **What it does:** The `ENTRYPOINT` script spins up first to safely handle runtime database installation/checks. Once the script finishes, it hands off system control over to the `CMD` string. `-F` forces PHP-FPM to stay running in the foreground as **PID 1**, keeping the container alive.

# Section 1: The WordPress Entrypoint Script (`entrypoint.sh`)

This script runs every time your WordPress container starts. It acts defensively: it checks if WordPress is already installed so it doesn't break your database on subsequent bootups.

## Script Setup & Safety Check

* `#!/bin/sh`
The **Shebang**. It tells Alpine to use the standard POSIX shell (`sh`) to interpret and run the rest of the file.
* `set -e`
A critical safety flag. It means "Exit immediately if any command fails (returns a non-zero exit code)." If a download or database connection fails, the script stops right there instead of breaking things further down.
* `if [ ! -f "wp-config.php" ]; then`
A conditional check: "If the file `wp-config.php` does **not** exist...". This ensures that if your container restarts, it skips the installation process and doesn't wipe out your existing database.

## A. Core Download

* `echo "WordPress is not installed. Initiating installation..."`
Prints an informational message to the container logs.
* `wp core download --allow-root`
Uses **WP-CLI** (the WordPress Command Line Interface) to download and extract the raw WordPress source code into your current working directory (`/var/www/html`).
> **Note on `--allow-root`:** WP-CLI is designed to block execution if you run it as the standard Linux root user for safety. Because Docker containers run as root by default, you *must* pass this flag on every WP-CLI command.



## B. Configuration File Generation

* `wp config create \`
Tells WP-CLI to dynamically generate your `wp-config.php` file using the arguments below.
* `--dbname="${MYSQL_DATABASE}"`
Injects the database name from your `.env` file into the config.
* `--dbuser="${MYSQL_USER}"`
Injects your database username.
* `--dbpass="${MYSQL_PASSWORD}"`
Injects your database password.
* `--dbhost=mariadb \`
**Crucial for Docker:** Instead of using `localhost`, you tell WordPress that the database lives on a host named `mariadb`. Docker's internal DNS automatically resolves this container name to its correct internal IP address.
* `--allow-root`
Bypasses the root user block.

## C. Core Installation

* `wp core install \`
Executes the actual setup. This talks to MariaDB, populates the database tables, and initializes the site.
* `--url="${DOMAIN_NAME}"`
Sets the primary domain of your site (e.g., `abnsila.42.fr`).
* `--title="${WP_TITLE}"`
Sets the visible site title.
* `--admin_user="${WP_ADMIN_USER}"`
Creates your primary administrator account username.
* `--admin_password="${WP_ADMIN_PASSWORD}"`
Sets the administrator's password.
* `--admin_email="${WP_ADMIN_EMAIL}"`
Sets the administrator's recovery email address.
* `--skip-email \`
Tells WordPress not to try sending a confirmation email (which would fail anyway since your container doesn't have an email server setup).
* `--allow-root`
Bypasses the root user block.

## D. Creating the Mandatory Second User

* `wp user create \`
Tells WP-CLI to register a brand new user profile in the database.
* `"${WP_USER}" \`
The username for your mandatory second user.
* `"${WP_EMAIL}" \`
The email address for this user.
* `--user_pass="${WP_PASSWORD}" \`
The password for this user.
* `--role=author \`
Sets the permissions level to **Author**. This fulfills the strict 42 Inception subject requirement: you must have one administrator, and one regular user who is *not* an admin.
* `--allow-root`
Bypasses the root user block.

## Script Wrap-Up

* `# chown -R nobody:nobody /var/www/html`
Currently commented out. If enabled, it recursively changes the owner of all WordPress files to the unprivileged `nobody` user so PHP-FPM can safely read and write to them.
* `echo "WordPress installation and configuration completed successfully!"`
Prints a success message to the container logs.
* `else` / `echo "WordPress is already configured. Skipping installation steps."` / `fi`
Handles the case where `wp-config.php` *was* found, ending the conditional install block.

## Handing over to PID 1

* `echo "Starting PHP-FPM..."`
Logs that the script is finished and the actual service is starting.
* `exec "$@"`
**This is the PID 1 magic trick.** The `exec` command kills the shell script process and replaces it entirely with whatever arguments were passed to the container when it started (usually something like `php-fpm83 -F`). This ensures that your PHP-FPM service takes over as **PID 1**, allowing it to catch shutdown signals properly.

---

# Section 2: The PHP-FPM Pool Configuration (`www.conf`)

This configuration dictates how the PHP-FPM processor behaves, handles security, and listens for requests coming from Nginx.

* `[www]`
Defines the pool name. `www` is the standard convention for web-facing pools.
* `user = nobody` / `group = nobody`
Tells PHP-FPM to switch away from the root user and execute all PHP code under the unprivileged `nobody` account. If a hacker exploits a vulnerability in WordPress, they only gain access to this locked-down user, protecting your container.
* `listen = 0.0.0.0:9000`
Tells PHP-FPM to listen for incoming connections on port `9000` on **all network interfaces** (`0.0.0.0`). If this were set to `127.0.0.1`, Nginx wouldn't be able to reach it from its own container.
* `pm = dynamic`
Sets the process manager to **dynamic**. It means PHP-FPM will scale the number of worker processes up or down based on how many users are browsing the site.
* `pm.max_children = 5`
The absolute maximum number of simultaneous worker processes allowed to run at once. This prevents your container from consuming too much RAM.
* `pm.start_servers = 2`
The number of worker processes spawned instantly when the container boots up.
* `pm.min_spare_servers = 1`
The minimum number of idle worker processes kept alive to handle sudden requests.
* `pm.max_spare_servers = 3`
The maximum number of idle worker processes kept alive before PHP-FPM starts killing them off to save memory.
* `clear_env = no`
**The most important line for Docker.** By default, PHP-FPM clears out all system environment variables before running scripts for security reasons. Setting this to `no` forces it to preserve them, allowing WordPress to read your database credentials (`MYSQL_USER`, etc.) passed in via Docker.

---