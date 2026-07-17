# Inception Description
Broaden your system administration skills by working with Docker. In this project, you'll set up a complete infrastructure using Docker Compose, creating and managing multiple containerized services including NGINX with SSL/TLS, WordPress with php-fpm, and MariaDB. You'll gain hands-on experience with containerization, networking, volume management, and secure web service deployment within your own personal virtual machine. 

## Table of Contents
- [Chapter 1: DevOps](#chapter-1-devops)
	- [Defenition](#defenition)
- [Chapter 2: Docker Foundations](#chapter-1-docker-foundations)
	- [Defenition](#defenition)
---

## Chapter 1 : DevOps

![The DevOps Lifecycle](assets/The%20DevOps%20Lifecycle.png)

### Defenition:

- DevOps (a blend of "Development" and "Operations") is a cultural and technical methodology that unites software developers and IT operations teams. It emphasizes automation, collaboration, and shared responsibility to deliver high-quality software faster, more securely, and more reliably.

### Core Practices

- CI/CD (Continuous Integration/Continuous Delivery): A method where code changes are automatically built, tested, and prepped for release.
- Infrastructure as Code (IaC): Managing and provisioning computing infrastructure through machine-readable definition files, rather than physical hardware configuration.
- Monitoring and Logging: Using real-time data to track application health and system performance.

### The DevOps Lifecycle

- The DevOps LifecycleThe DevOps process is continuous and iterative, typically moving through 8 key phases: `Plan` => `Code` => `Build` => `Test` => `Release` => `Deploy` => `Operate` => `Monitor` => `Repeat`

## Chapter 2 : Docker Foundations

![Docker Architecture](assets/docker-architecture.webp)

### Defenition:

- Docker is an open source platform that automates the deployment of applications inside software containers. It allows developers to package their applications and dependencies into a single container that can be deployed quickly and reliably across different computing environments. Docker containers provide an efficient way to package, distribute, and run applications on any infrastructure, from on-premise data centers to public clouds.

### Docker vs. VMs and Bare-Metal Servers


### What Makes Docker Useful?

- The main factors that make Docker useful for modern software delivery teams include:

    1. Portability
    2. Lightweight
    3. Scalability	
    4. Security

### Docker vs. VMs and Bare-Metal Servers

**Bare-Metal Servers**

- Virtualization Layer: None (direct hardware execution).

- Operating System: Single host operating system.

- Resource Overhead: Zero overhead.

- Boot & Setup Time: Minutes to hours.

- Isolation Boundary: No logical isolation on the host.

- Portability: Low (bound to specific hardware architectures).

**Virtual Machines (VMs)**

- Virtualization Layer: Hypervisor (hardware-level emulation).

- Operating System: Duplicated Guest OS per virtual machine.

- Resource Overhead: High (CPU, Memory, and Storage allocated to run full Guest OS instances).

- Boot & Setup Time: Minutes (due to complete Guest OS boot cycles).

- Isolation Boundary: Hard physical isolation enforced via hypervisor.

- Portability: Medium (dependent on virtual disk formats like VMDK or VHD).

**Docker Containers**

- Virtualization Layer: Container Engine (operating system-level abstraction).

- Operating System: Shared host kernel; no Guest OS needed.

- Resource Overhead: Extremely low (processes execute at native host speeds).

- Boot & Setup Time: Milliseconds to seconds.

- Isolation Boundary: Logical isolation via Linux kernel namespace and cgroup primitives.

- Portability: High (runs consistently on any host running a compatible container engine).

### How does Docker really work under the hood?

<!-- ![Docker under the hood](assets/docker_under_the_hood.jpeg) -->

<p align="center">
  <img src="./assets/docker_under_the_hood.jpeg" alt="Docker under the hood">
</p>


#### Layer 1: The User Interface

**Docker Client / CLI**

When you type docker run nginx, you are using the Docker CLI. The CLI itself does absolutely zero containerization work. It is just a friendly user interface. Its only job is to take your command, turn it into an HTTP request, and send it down the line.

**Docker REST API**

This is the bridge. The Docker Daemon (below) exposes a REST API. When the CLI wants to start a container, it sends a POST /containers/create request to this API (usually over a local Unix socket at /var/run/docker.sock).

**Docker Compose**

This is a tool that sits on top of the CLI. Instead of typing five different docker run commands with complex flags for your Inception project, Docker Compose reads your docker-compose.yml file and automatically sends a stream of API requests to the Docker REST API to build your entire stack.

#### Layer 2: The Brain (The Engine)

**dockerd (Docker Daemon)**

This is the background service always running on your host machine. When you manage images, create volumes, or set up virtual networks, dockerd is handling the logic. However, to comply with modern open-source standards, dockerd does not actually spin up or manage the processes inside containers anymore. It offloads that to the container runtimes.

**Docker Engine**

This is simply the marketing term for the combination of the Docker CLI, the REST API, and dockerd. When people say "install Docker," they usually mean install the Docker Engine.

#### Layer 3: The Manager & The Executor (The Runtimes)

To understand this layer, you need to know about the OCI (Open Container Initiative). The industry agreed on a standard way to run containers so that Docker, Kubernetes, and other tools could all use the same underlying technology. This split container management into two stages:

**1. containerd (High-Level Runtime)**

Originally built by Docker, this is now an independent, industry-standard tool. It acts as a supervisor. It listens to dockerd, goes out to the internet to pull container images, manages block storage, and prepares the network interfaces. Once everything is ready to boot, it passes the job to the low-level runtime.

**2. runc (Low-Level Runtime)**

This is a lightweight, bare-bones command-line tool whose sole purpose is to talk directly to the Linux kernel, spawn a container, and then immediately exit. It is the actual component that interacts with Linux primitives.

#### Layer 4: The Linux Primitives (What a "Container" Actually Is)

A container is not a virtual machine. There is no guest operating system. A container is just a normal Linux process that has been heavily isolated using two native features of the Linux kernel:

**Namespaces (Isolation)**

Namespaces trick a process into thinking it is the only thing running on the computer. Linux applies several namespaces to a container process:

- `PID Namespace:` The process thinks its ID is 1 (the root process), hiding all other processes on the host machine.

- `NET Namespace:` Gives the process its own virtual network card and routing table.

- `MNT Namespace:` Isolates the file system so the process can only see the directory root (/) provided by your container image.

**Cgroups / Control Groups (Resource Limits)**

While namespaces hide things, Cgroups restrict things. They allow the host kernel to say, "This specific process can only use a maximum of 512MB of RAM and 10% of the CPU." This prevents a malfunctioning container from crashing your entire host system.

#### Summary: The Lifecycle of docker run

![Container creation lifecycle](assets/container_creation_lifecycle.png)

When you execute a command, here is the chain reaction:

```Plaintext

[You type: docker run] 
       │
       ▼
[Docker CLI] ──(Sends HTTP REST request)──► [dockerd]
                                               │
                                               ▼
                                         [containerd] (Pulls image, sets up disk)
                                               │
                                               ▼
                                           [runc] (Configures Namespaces/Cgroups)
                                               │
                                               ▼
                                        [Linux Kernel] (Launches isolated process)
```

> [!NOTE]
> As I said, a container is a process like any other but when created it receives special configurations. So just like any process, it has a Process ID (PID) and a Parent Process ID (PPID) — we can find them with the following command:
> ```bash
>	docker top <container_name>
> ```

#### Conclusion

Docker simplifies software development using containers that share the host’s kernel, unlike virtual machines that run their own OS. Containers rely on key Linux features—namespaces and control groups (cgroups)—to ensure isolation and efficient resource management. Namespaces isolate system resources, while cgroups limit resource usage to prevent overloading.

## Chapter 3 PID 1:

In a traditional Linux system, **PID 1** (Process ID 1) is the `init` system (like `systemd` or `sysvinit`). It's the very first process that boots up, and it acts as the "ancestor" of every other process on the machine.

Inside a Docker container, things are different. There is no full operating system booting up; instead, the container just runs a single primary process, and **whatever process you launch via your Dockerfile becomes PID 1**.

If your primary process isn't designed to act like a system init process, you run into two major issues.

---

### The Two Major Responsibilities of PID 1

#### 1. Signal Forwarding (Why `docker stop` takes 10 seconds)

When you type `docker stop`, Docker sends a `SIGTERM` signal to PID 1, politely asking it to wrap up what it's doing, save data, and shut down gracefully.

A normal init system knows exactly what to do with this signal. But if a basic shell script or an unconfigured application is running as PID 1, it often doesn't know how to handle `SIGTERM`. It ignores it completely. Docker waits 10 seconds, loses patience, and sends a ruthless `SIGKILL` to force-stop the container.

> **The Risk:** For databases like MariaDB, a sudden `SIGKILL` can cause database corruption and data loss because it didn't get to close its open files properly.

#### 2. Reaping Zombie Processes

When a process creates a child process, and that child process finishes its job, it becomes a "zombie" until the parent process checks its exit status. If the parent process dies before checking, that child becomes an orphan.

In a normal OS, PID 1 adopts all orphaned processes and automatically clears ("reaps") them when they die. If your container's PID 1 doesn't do this, zombie processes accumulate, clog your system's process table, and can eventually crash the container.

---

### Dockerfile Best Practices to Master PID 1

The way you write your Dockerfile dictates whether your application behaves properly as PID 1. Here are the absolute best practices to follow:

#### 1. The Exec Form vs. The Shell Form

How you write your final `CMD` or `ENTRYPOINT` instruction completely changes how PID 1 is assigned.

* **❌ The Shell Form:** `CMD top`
Under the hood, Docker translates this to `/bin/sh -c "top"`. This means `/bin/sh` becomes PID 1, and your application (`top`) becomes a child process. Because `sh` does not forward signals, typing `docker stop` will never reach your app gracefully.
*   The Exec Form: `CMD ["top"]`
This executes the binary directly without spawning a shell. Your application (`top`) becomes PID 1 directly. If your binary handles signals well (like Nginx), it will shut down instantly and gracefully.

#### 2. Use a Lightweight Init System (`tini`)

If you are running applications that spawn multiple background processes or don't handle signals cleanly, you should use a micro-init utility like `tini` or `dumb-init`.

On an Alpine Linux base, you can install and configure `tini` to sit at PID 1, reap your zombies, and perfectly forward signals to your actual application:

```dockerfile
# Install tini
RUN apk add --no-cache tini

# Set tini as the entrypoint to manage PID 1
ENTRYPOINT ["/sbin/tini", "--"]

# Your actual command now runs safely under tini
CMD ["my-app-binary"]

```

---

### General Dockerfile Best Practices

Beyond PID 1, writing highly optimized Dockerfiles comes down to keeping things clean, secure, and fast to build.

* **Leverage Layer Caching:** Docker builds images layer by layer. If a layer changes, every layer *after* it must rebuild from scratch. Place things that change rarely (like installing packages) at the top of your Dockerfile, and things that change constantly (like copying source code) at the absolute bottom.
* **Combine Commands to Reduce Layers:** Every `RUN` instruction creates a new image layer, which increases the final image size. Group related setup steps using `&&` and backslashes `\`.
* **Clean Up the Package Cache Instantly:** Never leave package manager leftovers behind. If using Alpine, use `apk add --no-cache`. If using Debian/Ubuntu, always run `rm -rf /var/lib/apt/lists/*` in the exact same `RUN` command where you installed the packages.


## Chapter 4 :


## Chapter 5 :


## Recourses

[Docker 101: The Docker Components](https://www.sysdig.com/learn-cloud-native/docker-101-the-docker-components)

[How does Docker really work under the hood? — A dive into Docker’s internals](https://medium.com/@kuninoto/how-does-docker-really-work-under-the-hood-a-dive-into-dockers-internals-2fef63f7c9bb)

[How Docker Containers Work Under the Hood: Namespaces and Cgroups](https://atlantbh.com/blog/how-docker-containers-work-under-the-hood-namespaces-and-cgroups/)


[Inception Tutorial](https://tuto.grademe.fr/inception/#)
