# Developer Documentation: Architecture & Maintenance

This document maps out the technical blueprint of the containerized environment to assist developers in deploying, maintaining, and debugging the infrastructure.

---

## 1. Prerequisites & Environment Setup

Before launching the project from scratch, your development workspace must meet the following configuration profiles:

### System Requirements
*   **Operating System:** Linux Environment (Ubuntu/Debian distributions preferred).
*   **Core Packages:** `GNU Make`, `Docker Engine` (v20.10+), and `Docker Compose V2`.

### Essential Configuration File Blueprint
The environment depends on two foundational structural items placed outside the immediate runtime directory tree:

1.  **Environment Variables (`.env`):** Created inside the `srcs/` workspace directory to govern non-sensitive structural constants (e.g., volume names, database user strings, domain aliases).
2.  **Runtime Secrets Configuration:** Secure `.txt` string blocks must be present at the following structural relative positions:
    ```text
    ├── secrets/
    │   ├── db_password.txt
    │   ├── db_root_password.txt
    │   ├── wp_admin_password.txt
    │   └── wp_user_password.txt
    └── Inception/
        └── srcs/
            ├── docker-compose.yml
            └── .env
    ```

---

## 2. Build and Orchestration Pipeline

The execution sequence relies on `Make` wrapping directly around native `Docker Compose` operations. 


```

[ make / Makefile ]
│
▼
[ init target ] ───► Creates host storage paths (/home/abnsila/data/)
│
▼
[ docker compose ] ──► Compiles context files ──► Mounting Runtime Secrets

```

When you trigger `make` or `make build`, the compilation lifecycle executes as follows:
1.  The `init` target runs structural host preparations by making sure target persistent storage nodes exist on the machine.
2.  The Makefile calls the orchestration block directly: `docker compose -f ./srcs/docker-compose.yml up -d --build`.
3.  Docker Compose sets the context relative to the directory layout, meaning local configurations (`../secrets/`) are successfully reached.
4.  Custom individual `Dockerfiles` compile sequentially from pure Alpine images, avoiding bloated pre-made base stacks.

---

## 3. Essential Lifecycle & Diagnostic Commands

Use these low-level engineering commands to trace application states and execute live hot-fixes during active development loops:

### Streaming Continuous Container Logs
```bash
# General multi-stream logs
docker compose -f ./srcs/docker-compose.yml logs -f

# Target single service tracing
docker logs -f wordpress
docker logs -f mariadb

```

### Executing Live Interactive Shells

To jump straight inside the execution environment of an active container to inspect path configurations or testing scripts:

```bash
docker exec -it nginx sh
docker exec -it wordpress sh

```

### Manual Database Health Evaluation

To verify database privileges and access permissions directly within the running isolated memory block:

```bash
docker exec -it mariadb mariadb-admin ping -h localhost -u root -p$(cat /run/secrets/db_root_password)

```

---

## 4. Data Architecture & Persistence Strategy

Containers are stateless by default. To preserve site state across rebuilds and full system reboots, this project employs an explicitly defined host bind-mount architecture using Docker's `local` volume driver options.

### Hardcoded Host Storage Specifications

Data blocks bypass the default obscured `/var/lib/docker/` volume structures and write directly to deterministic target tracks on the host machine:

* **WordPress Filesystem Content:** `/home/abnsila/data/wordpress`
* **MariaDB Relational Database Core:** `/home/abnsila/data/mariadb`

### Structural Declaration Sample

The integration inside `docker-compose.yml` forces storage mapping directly into the host machine space:

```yaml
volumes:
  wordpress_vol:
    name: wordpress_vol
    driver: local
    driver_opts:
      type: 'none'
      o: 'bind'
      device: '/home/abnsila/data/wordpress'

```

### Core Developer Takeaway

Because these paths use real local bind rules, any source file changes or media alterations made by the system or application layer will write straight onto the physical system storage disk.

The data will successfully survive `docker compose down`, container crashes, and general developer rebuilds. It will only be permanently erased when the explicit database-wiping routine `make fclean` is triggered.
