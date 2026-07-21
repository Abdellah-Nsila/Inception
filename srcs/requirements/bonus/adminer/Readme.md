**Adminer** (formerly phpMinAdmin) is a lightweight, single-file database management tool written in PHP.

Think of it as a much cleaner, lightweight alternative to **phpMyAdmin**. Instead of logging into your `mariadb` container terminal and typing raw SQL queries, Adminer gives you a simple web interface in your browser to view tables, inspect user accounts, run queries, and modify database records directly.

In the **Inception** project, Adminer is one of the mandatory-choice **bonus services**.

---

## How to Set Up Adminer in Docker

Here is a simple, standard setup for an `adminer` container using Alpine and PHP's built-in web server.

### 1. Create the Dockerfile

Create a folder named `requirements/bonus/adminer/` and add a `Dockerfile`:

```dockerfile
FROM alpine:3.19

# Install PHP and the necessary MariaDB/MySQL drivers
RUN apk update && apk add --no-cache \
    php83 \
    php83-mysqli \
    php83-pdo_mysql \
    php83-session \
    wget

# Set up the working directory
WORKDIR /var/www/html

# Download the latest single-file Adminer releases
RUN wget https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php -O index.php

# Expose port 8080 for the standalone server
EXPOSE 8080

# Start PHP's built-in web server listening on port 8080
CMD ["php", "-S", "0.0.0.0:8080", "-t", "/var/www/html"]

```

---

### 2. Add Adminer to `docker-compose.yml`

Add the `adminer` service block to your compose file and hook it into your `inception_net` network:

```yaml
  adminer:
    build:
      context: ./requirements/bonus/adminer
    container_name: adminer
    image: adminer
    restart: unless-stopped
    ports:
      - "8080:8080"
    networks:
      - inception_net
    depends_on:
      - mariadb

```

*(Alternatively, if you want to route Adminer through Nginx on port 443 via `[https://abnsila.42.fr/adminer](https://abnsila.42.fr/adminer)`, you can configure Nginx as a reverse proxy/FastCGI handler for it instead of opening port 8080 directly).*

---

### 3. How to Log In & Test

Once you run `docker-compose up -d --build` (or `make`), open your browser and navigate to:

```text
http://localhost:8080  (or http://abnsila.42.fr:8080)

```

You will see the Adminer login screen. Fill in the fields using your Docker environment settings:

1. **System:** Form Field.
Select **MySQL** (MariaDB uses the MySQL protocol driver).


2. **Server:** Form Field.
Type **`mariadb`** *(This is the internal Docker network container name, NOT `localhost`)*.


3. **Username:** Form Field.
Type your database user (e.g., `root` or your `${MYSQL_USER}`).


4. **Password:** Form Field.
Type your corresponding password (`${MYSQL_ROOT_PASSWORD}` or `${MYSQL_PASSWORD}`).


5. **Database:** Form Field.
Type your database name (e.g., `${MYSQL_DATABASE}`).


Once logged in, you will be able to browse all your WordPress database tables (`wp_posts`, `wp_users`, etc.) directly from your browser!

- Go to `http://abnsila.42.fr:8080`