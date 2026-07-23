# Infrastructure & Containerization Architecture Showcase

This document breaks down the core architectural choices and system concepts implemented throughout this containerized infrastructure project. Understanding these trade-offs is essential for designing secure, high-performance, and scalable production environments.

---

# 📚 Table of Contents

- [1. Virtual Machines vs Docker Containers](#1-virtual-machines-vs-docker-containers)
- [2. Docker Secrets vs Environment Variables](#2-docker-secrets-vs-environment-variables)
- [3. Docker Network vs Host Network](#3-docker-network-vs-host-network)
- [4. Docker Volumes vs Bind Mounts](#4-docker-volumes-vs-bind-mounts)

---

# 1. Virtual Machines vs Docker Containers

Deploying applications requires isolation, but the mechanism chosen impacts system overhead, performance, and scalability.

## Architecture Comparison

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

## Virtual Machines (Hardware-Level Abstraction)

### Mechanism

A Hypervisor (e.g., VMware or VirtualBox) abstracts physical hardware and creates isolated virtual machines. Every VM requires its own complete Guest Operating System.

### Resource Overhead

- High RAM consumption
- Large disk usage
- Separate kernel per VM

### Isolation & Boot Time

- Strongest isolation (kernel-level)
- Boot time measured in minutes

---

## Docker Containers (OS-Level Abstraction)

### Mechanism

Containers leverage Linux kernel features:

- Namespaces
- cgroups
- Shared Host Kernel

### Resource Overhead

- Minimal RAM usage
- No Guest OS
- Starts only application processes

### Isolation & Boot Time

- Process-level isolation
- Starts in milliseconds

---

# 2. Docker Secrets vs Environment Variables

Managing sensitive runtime data requires strict access control.

## Environment Variables

### Behavior

Environment variables are stored directly inside the container configuration.

### Drawbacks

- Visible via

```bash
docker inspect <container_id>
```

- Persist inside container configuration
- Accessible by child processes

---

## Docker Secrets

### Behavior

Docker Secrets are managed by the Docker daemon and mounted as read-only files.

Location:

```text
/run/secrets/<secret_name>
```

### Advantages

- Never appear in image layers
- Never appear in `docker inspect`
- Stored only in memory (`tmpfs`)
- Removed immediately when the container exits
- Accessible only through the mounted file

---

# 3. Docker Network vs Host Network

Container networking affects isolation, security, and performance.

## Docker Bridge Network (Default)

### How it Works

Docker creates an isolated bridge network.

Containers receive private IP addresses.

Example subnet:

```text
172.18.0.0/16
```

### Communication

Containers communicate using Docker DNS.

Example:

```text
wordpress
      │
      ▼
mariadb:3306
```

External access requires port mapping.

Example:

```bash
docker run -p 443:443 nginx
```

### Best Use Case

- Production
- Microservices
- Internal database communication

---

## Host Network

```yaml
network_mode: host
```

### How it Works

The container shares the host network stack directly.

No bridge.

No NAT.

No virtual interfaces.

### Result

If nginx listens on port 80:

```text
Host:80
```

is occupied directly.

### Best Use Case

- High-performance networking
- Low-latency applications

---

# 4. Docker Volumes vs Bind Mounts

Containers are ephemeral.

Without external storage, deleting a container also deletes its filesystem changes.

## Storage Architecture

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

---

## Docker Volumes

### Management

Managed entirely by Docker.

Typical location:

```text
/var/lib/docker/volumes/
```

### Advantages

- Portable
- Safe
- Easy backups
- Recommended for databases
- Production-ready

---

## Bind Mounts

### Management

References any directory on the host.

Example:

```text
./srcs/nginx.conf
        │
        ▼
/etc/nginx/nginx.conf
```

### Advantages

- Excellent for development
- Instant file synchronization
- No rebuild required

### Drawbacks

- Container can modify host files
- Less isolated
- Host filesystem structure matters

---

# 📌 Summary

| Component | Recommended For |
|------------|-----------------|
| Virtual Machine | Strong isolation, multiple operating systems |
| Docker Container | Lightweight application deployment |
| Docker Secret | Passwords, API keys, certificates |
| Environment Variable | Non-sensitive configuration |
| Bridge Network | Production microservices |
| Host Network | High-performance networking |
| Docker Volume | Persistent production data |
| Bind Mount | Development workflows |