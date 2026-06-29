
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