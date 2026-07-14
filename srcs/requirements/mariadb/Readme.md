# 💾 MariaDB Container Setup

This container runs a secure, persistent MariaDB database server on Alpine Linux, custom-tailored to act as the database backend for our WordPress service.

---

## 🛠️ Configuration Breakdown

### 1. The Configuration (`mariadb-server.cnf`)

To allow other containers (like WordPress) to communicate with MariaDB, we override the default localhost-only binding.

```ini
[mysqld]
user = mysql
port = 3306
datadir = /var/lib/mysql
bind-address = 0.0.0.0
skip-networking = false

```

* **`bind-address = 0.0.0.0`**: Tells MariaDB to listen on all network interfaces inside the container's isolated network, rather than defaulting to just `127.0.0.1`.
* **`skip-networking = false`**: Ensures TCP/IP networking is enabled, allowing outside containers to connect.

---

### 2. The Dockerfile

An optimized Alpine 3.23 environment designed for security and speed.

```dockerfile
FROM alpine:3.23

# Install the server and command-line client
RUN apk update && apk add --no-cache mariadb mariadb-client

# Copy server configuration
COPY ./conf/mariadb-server.cnf /etc/my.cnf.d/mariadb-server.cnf

# Copy and set execution permissions on the initialization script
COPY ./tools/mariadb_start.sh /usr/local/bin/mariadb_start.sh
RUN chmod +x /usr/local/bin/mariadb_start.sh

EXPOSE 3306

ENTRYPOINT [ "/usr/local/bin/mariadb_start.sh" ]
CMD [ "mariadbd-safe", "--user=mysql" ]

```

* **`ENTRYPOINT` & `CMD` (The Exec Pattern)**: Using `ENTRYPOINT` for the setup script and passing the server daemon command via `CMD` allows the script to safely initialize the system and then hand over the process execution using `exec "$@"`.

---

### 3. The Entrypoint Script (`mariadb_start.sh`)

This script acts as the brains of our database initialization, ensuring **idempotency** (can run multiple times without breaking or losing data).

```sh
# 1. Setup system directories
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld
chown -R mysql:mysql /var/lib/mysql

```

* Ensures volatile system runtime directories exist (which might be cleared on container restart) and grants ownership to the restricted `mysql` system user so it has write access.

```sh
# 2. ONLY install the default system tables
if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing blank system tables..."
    mariadb-install-db --user=mysql --datadir=/var/lib/mysql --skip-test-db > /dev/null

```

* **The Idempotency Check**: It checks if `/var/lib/mysql/mysql` (the system database folder) already exists. If it does, **it skips initialization entirely**. This protects your persistent data across container restarts.
* **`mariadb-install-db`**: Generates the baseline system tables required for MariaDB to boot.

```sh
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

```

* **What is `--bootstrap` mode?**
Normally, to run setup SQL scripts, you have to boot the server, expose it to the network, log in with a temporary password, run commands, and shut it down.
The `--bootstrap` flag starts the MariaDB engine in a **silent, offline, single-threaded mode** that does not listen on any network port. It reads SQL commands directly from standard input (`stdin`), executes them, and exits. This is the gold standard for secure container provisioning.
* **The SQL Script (`EOF` block)**:
1. Secures the local root account with your password.
2. Creates your project database.
3. Creates a database user capable of logging in from any network host (`'%'`).
4. Grants that user full privileges over your database.
5. Purges default insecure anonymous users (`User=''`).



```sh
# 3. Boot the engine safely
echo "Starting raw MariaDB engine..."
exec "$@"

```

* **`exec "$@"`**: Instead of spawning `mariadbd-safe` as a child process of the shell script, `exec` replaces the shell process entirely. This makes `mariadbd-safe` **PID 1** inside the container. This is crucial because Docker sends stop signals (like `SIGTERM`) only to PID 1. Without this, your database won't shut down gracefully and could suffer table corruption!