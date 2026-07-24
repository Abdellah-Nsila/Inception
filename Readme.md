*This project has been created as part of the 42 curriculum by abnsila.*

# 🐳 Inception

A multi-container System Administration infrastructure project built with **Docker** and **Docker Compose**. The core goal of this project is to virtualize a complete, secure, and production-ready Web Application Stack on an isolated Docker network built strictly from custom **Alpine Linux** base images.

---

# 📚 Table of Contents

- [Description](#-description)
- [System Architecture](#-system-architecture)
- [Instructions](#-instructions)
  - [Prerequisites](#prerequisites)
  - [Build and Execution](#build-and-execution)
  - [Management Commands](#management-commands)
- [Technical & Design Choices](#-technical--design-choices)
- [System Design Comparison](#-system-design-comparison)
  - [1. Virtual Machines vs Docker Containers](#1-virtual-machines-vs-docker-containers)
  - [2. Docker Secrets vs Environment Variables](#2-docker-secrets-vs-environment-variables)
  - [3. Docker Network vs Host Network](#3-docker-network-vs-host-network)
  - [4. Docker Volumes vs Bind Mounts](#4-docker-volumes-vs-bind-mounts)
- [Resources & AI Usage](#-resources--ai-usage)

---

# 📝 Description

The **Inception** project focuses on building a resilient web hosting infrastructure entirely managed through `docker-compose`. Each component service runs in its own dedicated, lightweight container and communicates through an internal virtual network.

### Core Stack Features
* **Nginx**: Dedicated web server acting as the sole entry point, configured with TLS v1.2/v1.3 encryption (HTTPS on port 443).
* **WordPress + PHP-FPM**: Modern WordPress core instance backed by PHP-FPM for dynamic server-side rendering.
* **MariaDB**: Relational SQL database powering WordPress with isolated persistent storage.

### Bonus Services Included
* **Redis Cache**: In-memory data store providing object caching for WordPress database queries.
* **FTP Server (vsftpd)**: FTP interface allowing remote file management inside the shared web application volume.
* **Adminer**: Single-file web UI for database management and query inspection.
* **Portainer**: Docker management platform giving a visual UI to monitor live logs, CPU/RAM usage, and active containers.
* **Portfolio Web Page**: Static site service running a custom developer portfolio preview.

---

# 🏗️ System Architecture

```text
                                  [ Host Browser ]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   │  HTTPS (Port 443)      FTP (Port 21)      │
                   ▼                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  Inception Stack (Docker Network: inception_net)                                       │
│                                                                                        │
│   ┌──────────────┐          ┌───────────────────┐          ┌───────────────────────┐   │
│   │    Nginx     │ ──FastCGI│  WordPress + FPM  │ ──TCP:3306  │        MariaDB        │   │
│   │  (TLS v1.3)  │ ──Port 9000 │ (PHP 8.3 / WP-CLI)│          │   (Isolated Storage)  │   │
│   └──────┬───────┘          └─────────┬─────────┘          └───────────────────────┘   │
│          │                            │                                                │
│          │ Shared Volume              │ TCP:6379                                       │
│          │ (/var/www/html)            ▼                                                │
│          │                  ┌───────────────────┐                                      │
│          ├─────────────────>│    Redis Cache    │                                      │
│          │                  └───────────────────┘                                      │
│          │                                                                             │
│          ▼                                                                             │
│   ┌──────────────┐          ┌───────────────────┐          ┌───────────────────────┐   │
│   │  FTP Server  │          │   Adminer (Web UI)│          │ Portainer (Dashboard) │   │
│   │   (vsftpd)   │          │    (Port 8080)    │          │      (Port 9000)      │   │
│   └──────────────┘          └───────────────────┘          └───────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────┘

```

---

# 🚀 Instructions

### Prerequisites

* **Operating System**: Linux (Debian / Ubuntu recommended)
* **Packages**: `docker`, `docker-compose-plugin` (or `docker-compose`), `make`, `curl`
* **Local Domain Configuration**:
Add your domain alias to `/etc/hosts`:
```bash
127.0.0.1 abnsila.42.fr

```



---

### Build and Execution

The infrastructure is fully automated using a top-level `Makefile`.

1. **Clone the Repository:**
```bash
git clone [https://github.com/Abdellah-Nsila/Inception.git](https://github.com/Abdellah-Nsila/Inception.git)
cd Inception

```


2. **Prepare Environment Credentials:**
Ensure sensitive passwords are listed inside the `secrets/` directory (`db_root_password.txt`, `db_password.txt`, etc.).
3. **Start the Infrastructure:**
```bash
make

```


*This command creates host data directories, builds base images sequentially without cache issues, and starts all containers in detached mode.*
4. **Access the Services:**
* **Main Web Site**: `https://abnsila.42.fr`
* **Adminer DB Client**: `http://abnsila.42.fr:8080`
* **Portainer Container UI**: `http://abnsila.42.fr:9000`
* **FTP File Access**: `curl -u ftp_user:ftp_password ftp://abnsila.42.fr:21/`

---
Here is a complete breakdown of your `Makefile` rules, followed by the updated README section and how to fix/test your FTP connection.

---

## 🛠️ Breakdown of Your `Makefile` Rules

| Rule | Dependencies | What It Does Under the Hood |
| --- | --- | --- |
| **`all`** | `init build` | The default rule executed when you just run `make`. It creates the host directories first (`init`), then builds and starts the container stack (`build`). |
| **`init`** | *(None)* | Uses `mkdir -p` (stored in `$(MKDIR)`) with `sudo` privileges to physically create persistent host directories for MariaDB, WordPress, Redis, and Portainer volumes before Docker tries to mount them. |
| **`up`** | `init` | Runs `docker compose up -d`. Starts pre-built containers in detached mode (background). If an image isn't built yet, Docker builds it. |
| **`build`** | `init` | Runs `docker compose up -d --build`. Forces Docker Compose to **rebuild all Dockerfiles** from scratch even if images already exist, then starts the stack in detached mode. |
| **`down`** | *(None)* | Runs `docker compose down`. Stops running containers and removes their container instances and internal networks without touching persistent database volumes. |
| **`stop`** | *(None)* | Runs `docker compose stop`. Pauses/stops running containers, but leaves container instances intact in memory so they can be resumed instantly with `make start`. |
| **`start`** | *(None)* | Runs `docker compose start`. Resumes previously stopped containers without recreating them or re-evaluating configuration files. |
| **`status`** | *(None)* | Runs `docker ps`. Prints an active table of running containers, their ports, status, and names. |
| **`clean`** | `down` | Runs `docker compose down --volumes --remove-orphans`. Stops containers and **deletes all named volumes attached to Compose**, as well as any orphan containers not defined in the compose file. |
| **`fclean`** | `clean` | **Full nuclear purge**: Calls `clean`, deletes the physical host persistent directories (`rm -rf`) via `sudo`, and runs `docker system prune -a --force` to delete all cached images, networks, and build caches across your entire host. |
| **`re`** | `fclean all` | Performs a full reset by wiping everything (`fclean`) and rebuilding the whole infrastructure from zero (`all`). |

---

### Management Commands

* **Build & Start Services**:
```bash
  make

```

* **Start Stopped Services**:
```bash
make start

```


* **Stop Running Services**:
```bash
make stop

```


* **View Active Containers**:
```bash
make status

```


* **View Real-Time Logs**:
```bash
make logs

```


* **Clean Volumes and Rebuild Stack**:
```bash
make re
# or
make fclean && make

```

---

# 🛠️ Technical & Design Choices

* **Alpine Linux as Universal Base**: Every container is built on official Alpine Linux and penultimate stable version image (`alpine:3.23`) to minimize image size and reduce security attack surfaces.
* **Docker Secrets over Environment Variables**: Credentials like database passwords and admin login keys are managed using Docker Secrets. They are mounted at runtime in temporary in-memory filesystems (`/run/secrets/`) rather than exposed as environment variables via `docker inspect`.
* **Zero Pre-made Docker Hub App Images**: Custom Dockerfiles were written from scratch for every service (Nginx, MariaDB, WordPress, FTP, Adminer, Portainer). No pre-packaged container images (e.g., `bitnami/wordpress`) are used.
* **To test Ftp:**
- Upload a file via FTP
```sh
echo "<h1>FTP Works!</h1>" > test.html
curl -T test.html -u ftp_user:ftp_password ftp://abnsila.42.fr:21/
```
- Verify the file exists inside WordPress via Nginx in your browser:
```sh
https://abnsila.42.fr/test.html
```
* **To test Redis:**
```sh
docker exec -it redis redis-cli
```

---

# 📐 System Design Comparison

### 1. Virtual Machines vs Docker Containers

Deploying applications requires isolation, but the mechanism chosen impacts system overhead, performance, and scalability.

#### Architecture Comparison

```text
+---------------------------------------+     +---------------------------------------+
|          VIRTUAL MACHINES             |     |           DOCKER CONTAINERS           |
+---------------------------------------+     +---------------------------------------+
| [ App A ] [ App B ]                   |     | [ App A ] [ App B ]                   |
| [ Bins/Libs ] [ Bins/Libs ]           |     | [ Bins/Libs ] [ Bins/Libs ]           |
| [ Guest OS ] [ Guest OS ]             |     +---------------------------------------+
| (Requires full OS kernel per VM)      |     | [ Docker Engine / Containerd ]        |
+---------------------------------------+     +---------------------------------------+
| [ Hypervisor (Type 1/2) ]             |     | [ Host OS Kernel ]                    |
+---------------------------------------+     +---------------------------------------+
| [ Physical Hardware ]                 |     | [ Physical Hardware ]                 |
+---------------------------------------+     +---------------------------------------+

```

#### Virtual Machines (Hardware-Level Abstraction)

* **Mechanism**: A Hypervisor (e.g., VMware or VirtualBox) abstracts physical hardware and creates isolated virtual machines. Every VM requires its own complete Guest Operating System.
* **Resource Overhead**: High RAM consumption, large disk usage, separate kernel per VM.
* **Isolation & Boot Time**: Strongest isolation (kernel-level), boot time measured in minutes.

#### Docker Containers (OS-Level Abstraction)

* **Mechanism**: Containers leverage Linux kernel features (Namespaces and Control Groups / cgroups) to share the single Host Kernel.
* **Resource Overhead**: Minimal RAM usage, no Guest OS overhead, executes processes directly.
* **Isolation & Boot Time**: Process-level isolation, starts instantly in milliseconds.

---

### 2. Docker Secrets vs Environment Variables

Managing sensitive runtime data requires strict access control.

#### Environment Variables

* **Behavior**: Stored directly inside container environment configuration files.
* **Drawbacks**: Visible plainly via `docker inspect <container_id>`, persist inside container metadata, and inherit automatically down to child processes.

#### Docker Secrets

* **Behavior**: Managed by the Docker daemon and mounted at runtime as read-only virtual files located under `/run/secrets/<secret_name>`.
* **Advantages**: Never appear in static image layers or `docker inspect` outputs. Stored exclusively in RAM (`tmpfs`), wiped upon container destruction, and scoped only to designated containers.

---

### 3. Docker Network vs Host Network

Container networking affects isolation, security, and performance.

#### Docker Bridge Network (Default)

* **How it Works**: Docker creates an isolated virtual bridge network where containers receive private IP addresses (e.g., `172.18.0.0/16`).
* **Communication**: Containers communicate securely using internal Docker DNS names (`wordpress`, `mariadb`, `redis`). External access requires explicit port mapping (`-p 443:443`).
* **Best Use Case**: Isolated production stacks and secure inter-service communication.

#### Host Network (`network_mode: host`)

* **How it Works**: Disables network isolation between the container and the host. The container shares the host network stack directly without NAT or virtual bridge interfaces.
* **Result**: Services bind directly to host network ports (e.g., Nginx listening on port 80 occupies the host's physical port 80).
* **Best Use Case**: Ultra-high performance networking requiring zero network translation latency.

---

### 4. Docker Volumes vs Bind Mounts

Containers are ephemeral. Without external storage, deleting a container deletes all modified filesystem state.

```text
                 HOST FILESYSTEM

     Bind Mount                     Docker Volume

+-------------------+         +---------------------------+
| /home/user/srcs/  |         | /var/lib/docker/volumes/ |
+---------+---------+         +------------+--------------+
          |                                |
          +---------------+----------------+
                          |
                    CONTAINER
                  +---------------+
                  | /var/www/html |
                  +---------------+

```

#### Docker Volumes

* **Management**: Managed entirely by Docker in host storage areas (e.g., `/var/lib/docker/volumes/`).
* **Advantages**: Portable, safe from accidental human edits, easily backed up, and optimized for high-performance databases in production.

#### Bind Mounts

* **Management**: References any explicit file or directory path directly on the host machine (e.g., `./srcs/nginx.conf:/etc/nginx/nginx.conf`).
* **Advantages**: Excellent for development workflows; provides real-time file synchronization without requiring container rebuilds.
* **Drawbacks**: Less isolated; container actions directly alter host files and permissions.

---

### 📌 Summary Table

| Component | Recommended For |
| --- | --- |
| **Virtual Machine** | Strong kernel isolation, running distinct operating systems |
| **Docker Container** | Lightweight, high-density microservice application deployment |
| **Docker Secret** | Sensitive credentials (passwords, TLS certificates, keys) |
| **Environment Variable** | Non-sensitive runtime flags and options |
| **Bridge Network** | Multi-container microservice isolation |
| **Host Network** | High-performance / low-latency networking |
| **Docker Volume** | Persistent production databases and dynamic user uploads |
| **Bind Mount** | Live code development and configuration file sharing |

---

# 📖 Resources & AI Usage

### References & Documentation

* [Official Docker Documentation](https://docs.docker.com/get-started/)
* [ Docker and Kubernetes | العلبة دي فيها سوعبان ](https://www.youtube.com/watch?v=PrusdhS2lmo)
* [Docker 101: The Docker Components](https://www.sysdig.com/learn-cloud-native/docker-101-the-docker-components)
* [How does Docker really work under the hood? — A dive into Docker’s internals](https://medium.com/@kuninoto/how-does-docker-really-work-under-the-hood-a-dive-into-dockers-internals-2fef63f7c9bb)
* [How Docker Containers Work Under the Hood: Namespaces and Cgroups](https://atlantbh.com/blog/how-docker-containers-work-under-the-hood-namespaces-and-cgroups/)
* [Inception Tutorial](https://tuto.grademe.fr/inception/#)
* [Nginx Core Directives & SSL Guide](https://nginx.org/en/docs/)

### AI Assistance Declaration

In accordance with 42 project regulations, Artificial Intelligence tools were utilized during the project for:

1. **Technical Documentation & Verification**: Reading official manual pages and confirming runtime flag behaviors.
2. **Debugging Process Signals & Logs**: Troubleshooting service exit codes, signal propagation (`SIGTERM` vs `SIGQUIT`), and permissions behavior across shared volume mounts.
3. **Architecture Best Practices**: Reviewing optimal approaches for multi-container coordination using Docker Compose and Docker Secrets.
