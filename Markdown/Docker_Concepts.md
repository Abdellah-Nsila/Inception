# Docker Core Concepts

> A structured reference for the core pillars of containerization — built for **Inception 42**.

---

## Table of Contents

- [Images — The Blueprints](#1-images--the-blueprints)
- [Containers — The Living Processes](#2-containers--the-living-processes)
- [Registries — The Library](#3-registries--the-library)
- [Docker Compose — The Conductor](#4-docker-compose--the-conductor)

---

## 1. Images — The Blueprints

An **Image** is an immutable (read-only) template containing everything needed to run a program: application code, runtime engine, system tools, libraries, and settings.

### How Images Work

| Concept | Description |
|---|---|
| **Layered File System (UFS)** | Images are built using a Union File System. Each Dockerfile instruction (`RUN`, `COPY`, `ADD`) creates a new read-only layer. |
| **Storage Efficiency** | Layers are cached and shared. Three images built `FROM debian:bullseye` share the exact same base layers on disk — O(1) storage for shared components. |
| **Ephemeral Architecture** | When instantiated into a container, a thin writable *Container Layer* is added on top of the immutable image layers. |

### Image Commands

| Command | Description | Example |
|---|---|---|
| `docker build` | Build an image from a local Dockerfile | `docker build -t my-app:1.0 .` |
| `docker images` | List all locally cached images | `docker images` |
| `docker inspect` | Return low-level system info in JSON | `docker inspect debian:bullseye` |
| `docker history` | Show build history and layers | `docker history my-app:1.0` |
| `docker tag` | Create a tag alias pointing to a source image | `docker tag my-app:1.0 user/my-app:1.0` |
| `docker rmi` | Delete a local image | `docker rmi user/my-app:1.0` |
| `docker image prune` | Remove all dangling/unused images | `docker image prune -a` |

---

## 2. Containers — The Living Processes

A **Container** is a runnable, isolated instance of an image. It is not a virtual machine — it is a normal host process wrapped in Linux Kernel isolation mechanisms.

### Isolation Mechanisms

#### Namespaces (Isolation Boundaries)

| Namespace | Purpose |
|---|---|
| `pid` | Isolates process trees — the container's main process runs as **PID 1** |
| `net` | Grants its own virtual IP, routing rules, and ports |
| `mnt` | Isolates the filesystem root |
| `ipc` | Inter-process communication isolation |
| `uts` | Hostname isolation |
| `user` | User ID mappings |

#### Control Groups / Cgroups (Resource Limits)

Restricts physical hardware consumption — sets maximum limits for **RAM**, **CPU cycles**, and **Disk I/O**.

### Container Commands

| Command | Description | Example |
|---|---|---|
| `docker run` | Create and start a container | *(see flags below)* |
| `docker ps` | List running containers | `docker ps` |
| `docker ps -a` | List all containers (running + stopped) | `docker ps -a` |
| `docker logs` | Retrieve container output logs | `docker logs -f node-server` |
| `docker exec` | Execute a process inside a running container | `docker exec -it node-server /bin/sh` |
| `docker stop` | Gracefully stop (sends SIGTERM → SIGKILL) | `docker stop node-server` |
| `docker kill` | Force-kill immediately (sends SIGKILL) | `docker kill node-server` |
| `docker restart` | Restart a running or stopped container | `docker restart node-server` |
| `docker rm` | Remove a stopped container | `docker rm node-server` |
| `docker stats` | Live stream of container resource usage | `docker stats` |

### Key `docker run` Flags

| Flag | Description |
|---|---|
| `-d` | Run in detached background mode |
| `-it` | Interactive mode (`-i` keeps STDIN open, `-t` allocates a pseudo-TTY) |
| `-p <host>:<container>` | Forward host ports to container interfaces (e.g., `-p 8080:8080`) |
| `--name <name>` | Assign a friendly identifier |
| `-v <host_path>:<container_path>` | Mount a persistent directory or volume |
| `--network <network>` | Connect to a specific Docker network |
| `--restart <policy>` | Define start behavior (`always`, `on-failure`, `unless-stopped`) |

---

## 3. Registries — The Library

A **Registry** is a centralized storage system used to host and distribute Docker images.

### Key Concepts

| Concept | Description |
|---|---|
| **Public vs. Private** | Docker Hub is the default public registry. Private registries (AWS ECR, GitHub Packages, self-hosted) are used for enterprise/academic environments. |
| **Repositories** | A registry holds one or more repositories — collections of versioned image tags (e.g., `debian:bullseye`, `debian:bookworm`). |

### Registry Commands

| Command | Description | Example |
|---|---|---|
| `docker login` | Authenticate with a registry | `docker login` |
| `docker logout` | Log out from a registry | `docker logout` |
| `docker pull` | Download an image from a registry | `docker pull mariadb:10.6` |
| `docker push` | Upload a tagged image to a registry | `docker push user/server:latest` |
| `docker search` | Search Docker Hub for public images | `docker search wordpress` |

---

## 4. Docker Compose — The Conductor

**Docker Compose** defines, coordinates, and runs multi-container Docker applications via a single `docker-compose.yml` configuration file translated into Docker Daemon API calls.

### How Compose Works

| Feature | Description |
|---|---|
| **Declarative Environments** | Instead of complex `docker run` shell scripts, you declare the desired end-state of your network, volumes, and services in human-readable YAML. |
| **Automatic DNS & Networking** | Compose builds an isolated bridge network automatically. Services resolve each other by name (e.g., WordPress connects to `mysql:3306` directly). |
| **Dependency Management** | Evaluates container readiness via service healthchecks, ensuring safe startup order. |

### Basic `docker-compose.yml` Structure

```yaml
services:
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mariadb:10.6
    environment:
      MYSQL_ROOT_PASSWORD: secret
    healthcheck:
      test: ["CMD", "mysqladmin", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

networks:
  default:
    driver: bridge

volumes:
  db_data:
```

### Compose Commands

| Command | Description |
|---|---|
| `docker compose up -d` | Build and start all services in detached mode |
| `docker compose down` | Stop and remove containers, networks |
| `docker compose down -v` | Also remove named volumes |
| `docker compose logs -f` | Follow logs for all services |
| `docker compose ps` | List running service containers |
| `docker compose build` | Rebuild service images |
| `docker compose exec <service> sh` | Open a shell inside a running service |

---

*Reference built for Inception 42 — 42 School project:* 
[docker_cheatsheet](https://docs.docker.com/get-started/docker_cheatsheet.pdf)