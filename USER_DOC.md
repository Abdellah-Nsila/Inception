# User Documentation: Inception Infrastructure Stack

This guide explains how to interact with, manage, and verify the multi-container web architecture provided by this stack.

---

## 1. Services Provided by the Stack

The infrastructure runs an isolated microservice architecture composed of core mandatory components and added bonus microservices:

### Core Mandatory Services

| Service | Technology | Role within the Stack |
| --- | --- | --- |
| **Nginx** | Alpine Linux / Nginx | The sole entry point. Operates as a secure web server and reverse proxy enforcing strict TLS v1.2/v1.3 protocols. It safely routes incoming traffic over port 443 to backend services. |
| **WordPress** | Alpine Linux / PHP-FPM | The application layer hosting the WordPress website. It processes dynamic scripts and interacts directly with the database. |
| **MariaDB** | Alpine Linux / MariaDB | The relational database backend. It runs as a fully isolated service, hidden from the public internet, storing all persistent site content and user configurations. |

### Bonus Microservices

| Service | Technology | Role within the Stack |
| --- | --- | --- |
| **Redis** | Alpine Linux / Redis | In-memory key-value cache. Speeds up WordPress performance by caching database queries and user sessions. |
| **Adminer** | Alpine Linux / PHP | Lightweight database management web interface. Allows easy inspection and modification of MariaDB tables through a web browser. |
| **Portainer** | Alpine Linux / Portainer Community Edition | Graphical management dashboard. Provides a web interface to inspect containers, networks, volumes, and system resource usage. |
| **Portfolio** | Alpine Linux / Vite + React | Standalone personal static/interactive portfolio website hosted as a dedicated microservice. |
| **FTP Server** | Alpine Linux / vsftpd | File Transfer Protocol service allowing direct file upload/download access to the shared WordPress directory (`/var/www/html`). |

---

## 2. Starting and Stopping the Project

Management of the container lifecycle is abstracted through standard automation commands via the project's `Makefile`. Run these from the repository root:

* **Start & Build the Stack:** Initializes local data host directories, evaluates credentials, builds custom images, and launches all core and bonus services in detached (background) mode.
```bash
make

```


* **Stop the Stack:** Safely stops all active service containers without destroying persistent application data.
```bash
make down

```


* **Soft Clean Up:** Tears down the containers and completely unmounts the internal networks.
```bash
make clean

```


* **Full Hard Clean Up:** Stops all services, strips away internal volumes, permanently wipes local data directories from the host filesystem, and clears out the built image cache.
```bash
make fclean

```



---

## 3. Accessing Web Services & Tools

### DNS Configuration Prerequisite

The stack is mapped to a dedicated local domain variant. Before attempting to open connections in a browser, your host operating system must know how to translate this domain name.

Add the following translation rule to your local `/etc/hosts` file:

```text
127.0.0.1    abnsila.42.fr

```

---

### Access URLs

Once the routing rule is in place, you can access all web services via HTTPS:

| Interface / Service | Access URL | Description |
| --- | --- | --- |
| **Public Website** | `[https://abnsila.42.fr](https://abnsila.42.fr)` | Main WordPress landing page. |
| **WordPress Admin** | `[https://abnsila.42.fr/wp-admin](https://abnsila.42.fr/wp-admin)` | WordPress backend management dashboard. |
| **Adminer (DB UI)** | `[https://abnsila.42.fr/adminer](https://abnsila.42.fr/adminer)` | Graphical interface to manage MariaDB database tables. |
| **Portainer** | `[https://abnsila.42.fr/portainer](https://abnsila.42.fr/portainer)` | Docker management UI to view containers, logs, and networks. |
| **Personal Portfolio** | `[https://abnsila.42.fr/portfolio](https://abnsila.42.fr/portfolio)` | Standalone developer portfolio app. |

---

### Connecting to the FTP Server

The FTP server exposes dedicated network ports to allow direct file management of the WordPress site (`/var/www/html`).

* **FTP Host:** `abnsila.42.fr`
* **FTP Port:** `21` (Control Channel)
* **Passive Ports:** `30000-30005` (Data Transfer Channel)

#### Example 1: Connecting via FileZilla (Recommended GUI)

1. Open FileZilla.
2. Set **Host:** `abnsila.42.fr`, **Username:** `ftp_user`, **Password:** *(found in secrets)*, **Port:** `21`.
3. Set Transfer Mode to **Passive**.
4. Click **Quickconnect**.

#### Example 2: Testing via Terminal (`curl`)

List the files in the WordPress root folder:

```bash
curl -l -u ftp_user:ftpPass ftp://abnsila.42.fr:21/

```

---

## 4. Locating and Managing Credentials

For production-grade security, this project entirely rejects passing plaintext passwords inside standard configuration environments.

### Secure Architecture

* **Storage Location:** Raw user, admin, database, and FTP passwords reside locally outside the public application space within the `secrets/` directory.
* **Runtime Injection:** These credentials are dynamically provisioned into system memory at the exact millisecond the containers boot up using **Docker Secrets**.
* **Why This Matters:** Sensitive strings are completely absent from source images. An attacker cannot discover your production keys by inspecting image history, extracting built layers, or viewing standard `docker inspect` environment tables.

---

## 5. Verifying Service Health

You can check that all mandatory and bonus microservices are performing correctly through multiple validation approaches:

### Option A: The Command Line Interface (CLI)

Run a process lookup to verify that all 7 container nodes are running and active:

```bash
docker ps

```

Your MariaDB container should explicitly display `(healthy)` in the status column, confirming it passed its automated configuration integrity check.

### Option B: Testing Redis Cache Functionality

To confirm that WordPress is utilizing the Redis bonus container for object caching:

1. Log into your WordPress container terminal:
```bash
docker exec -it wordpress wp redis status --allow-root

```


2. Check if Redis keys are populated:
```bash
docker exec -it redis redis-cli ping

```


*(Should output `PONG`)*

### Option C: Inter-Container Network Testing

To prove that internal services are isolated yet properly linked inside their internal network bridge:

```bash
docker exec nginx ping -c 2 wordpress
docker exec nginx ping -c 2 adminer
docker exec wordpress ping -c 2 mariadb
docker exec wordpress ping -c 2 redis

```

### Option D: Visual Extension Tools

If you use Visual Studio Code, open the **Docker Extension**. The side panel provides a live graphical view showing the status tree of the `inception_net` network block, running active container nodes, and connected storage volume maps at a glance.