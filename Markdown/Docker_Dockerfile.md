# 🐳 Dockerfile Architecture, Layer Compilation & Optimization

> A comprehensive reference for understanding how Dockerfiles are translated into optimized Docker images.
>
> This guide explains:
>
> - Why Dockerfiles exist
> - Dockerfile syntax
> - Image layers
> - Layer caching
> - Build optimization
> - Best practices

---

# 📚 Table of Contents

- [1. Declarative vs. Imperative](#1-declarative-vs-imperative)
- [2. Dockerfile Anatomy](#2-dockerfile-anatomy)
- [3. Dockerfile Instructions & Layers](#3-dockerfile-instructions--layers)
- [4. Layer Caching](#4-layer-caching)

---

# 1. Declarative vs. Imperative

When building Docker images there are **two approaches**.

| Imperative | Declarative |
|------------|-------------|
| Manual modifications | Dockerfile |
| Uses `docker commit` | Uses `docker build` |
| Difficult to reproduce | Fully reproducible |
| Large images | Optimized images |
| Poor documentation | Infrastructure as Code |

---

## Build Method Comparison

```text
           BUILD METHOD COMPARISON

    Imperative                     Declarative
    docker commit                  Dockerfile

┌─────────────────────┐      ┌─────────────────────┐
│ Start Container     │      │ Write Dockerfile    │
│ Install packages    │      │ docker build        │
│ Modify filesystem   │      │ Automatic build     │
│ docker commit       │      │ Version controlled  │
└──────────┬──────────┘      └──────────┬──────────┘
           │                            │
           ▼                            ▼

 ❌ No reproducibility           ✅ Reproducible
 ❌ Image bloat                  ✅ Layer caching
 ❌ Manual process               ✅ Automated builds
```

---

## 🚫 The Legacy Trap: `docker commit`

The old workflow consisted of:

1. Start a container.
2. Enter the shell.
3. Install software manually.
4. Modify configuration files.
5. Run `docker commit`.

Example:

```bash
docker run -it debian bash

apt update
apt install nginx

docker commit <container-id> my-nginx
```

### Problems

- ❌ No build history
- ❌ Impossible to reproduce
- ❌ Large images
- ❌ Security auditing becomes difficult
- ❌ Temporary files become permanent

---

## ✅ The Modern Solution: Dockerfile

A **Dockerfile** is a declarative build script.

Docker executes every instruction sequentially and converts each filesystem modification into an immutable image layer.

Benefits:

- Version controlled
- Easy collaboration
- Cached builds
- Repeatable environments
- Lightweight images

---

# 2. Dockerfile Anatomy

## File Naming

The default filename is:

```text
Dockerfile
```

No extension is required.

---

## Multiple Dockerfiles

For different environments you can create:

```text
Dockerfile.dev
Dockerfile.test
Dockerfile.production
Dockerfile.prod
```

Specify one using:

```bash
docker build \
    -f Dockerfile.production \
    -t my-app:1.0 .
```

---

## Dockerfile Syntax

Every instruction follows the same structure:

```Dockerfile
# Comment

INSTRUCTION arguments
```

Example:

```Dockerfile
FROM debian:bookworm

RUN apt update

COPY . /app

CMD ["bash"]
```

---

## Naming Convention

Docker instructions are **case-insensitive**, but the standard convention is:

```Dockerfile
FROM
RUN
COPY
WORKDIR
CMD
ENTRYPOINT
```

instead of

```Dockerfile
from
run
copy
```

This improves readability.

---

# 3. Dockerfile Instructions & Layers

Not every Dockerfile instruction creates a filesystem layer.

Understanding which instructions generate layers is essential for writing efficient Dockerfiles.

---

## Compilation Pipeline

```text
Dockerfile

FROM alpine
      │
      ▼
Base Layer

RUN apk add nginx
      │
      ▼
Filesystem Layer

COPY app/
      │
      ▼
Filesystem Layer

ENV PORT=80
      │
      ▼
Metadata Only
```

---

## Layer-Generating Instructions

These instructions create **read-only filesystem snapshots**.

| Instruction | Description |
|------------|-------------|
| `FROM` | Creates the base image layer |
| `RUN` | Executes commands and stores filesystem changes |
| `COPY` | Copies files from build context |
| `ADD` | Copies files, extracts archives, or downloads remote URLs |

---

### Example

```Dockerfile
FROM alpine

RUN apk add nginx

COPY ./app /app
```

Produces:

```text
Layer 3  COPY app
────────────────────
Layer 2  Install nginx
────────────────────
Layer 1  Alpine Linux
```

---

## Metadata Instructions

These instructions **do not create filesystem layers**.

Instead, they modify the image metadata.

| Instruction | Purpose |
|------------|---------|
| `ENV` | Environment variables |
| `WORKDIR` | Working directory |
| `EXPOSE` | Declared ports |
| `USER` | Default execution user |
| `CMD` | Default startup command |
| `ENTRYPOINT` | Executable to launch |

---

> **Note**
>
> Docker images should generally stay well below the OverlayFS limit of **127 layers**.

---

# 4. Layer Caching

Docker builds images **from top to bottom**.

Before executing an instruction Docker checks whether an identical layer already exists.

If it does:

```text
Cache Hit
```

Docker reuses the existing layer.

Otherwise:

```text
Cache Miss
```

The instruction is executed again.

---

## Cache-Busting

Changing one instruction invalidates every instruction below it.

```text
FROM Debian
      │
RUN apt install nginx
      │
COPY .
      │
CMD
```

If the `COPY` instruction changes:

```
FROM     ✅ Cached
RUN      ✅ Cached
COPY     ❌ Rebuilt
CMD      ❌ Rebuilt
```

---

## ❌ Bad Practice

```Dockerfile
FROM debian:bookworm

COPY . /app

RUN apt-get update && \
    apt-get install -y nginx php-fpm curl
```

Changing one application file forces Docker to reinstall every package.

---

## ✅ Good Practice

Place static instructions first.

```Dockerfile
FROM debian:bookworm

RUN apt-get update && \
    apt-get install -y \
        curl \
        nginx \
        php-fpm && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .
```

Now package installation stays cached while only the application code is rebuilt.

---

## Best Practices

- Keep frequently changing files near the bottom.
- Combine package installations into a single `RUN`.
- Remove package caches.
- Prefer `COPY` over `ADD` unless archive extraction is required.
- Keep Dockerfiles readable.
- Take advantage of Docker's layer cache to speed up builds.

---

# 5. Build Context & `.dockerignore`

When running:

```bash
docker build -t app:1.0 .
```

the final dot (`.`) specifies the **Build Context**.

Before Docker starts executing any instructions in the Dockerfile, it packages **every file and directory** inside the build context and sends them to the Docker daemon.

```text
Project Directory
        │
        ▼
 Build Context (.)
        │
        ▼
 Docker CLI
        │
        ▼
 Docker Daemon
        │
        ▼
 Image Build
```

---

## Why Build Context Matters

The larger the build context, the longer Docker takes to transfer files before the build even begins.

Mathematically:

```text
Transfer Time ∝ Build Context Size
```

Large projects containing unnecessary files can significantly increase build times.

---

## 🛡 The `.dockerignore` File

The `.dockerignore` file works exactly like **`.gitignore`**.

It tells Docker which files and directories should **not** be included in the build context.

```
Project
│
├── Dockerfile
├── .dockerignore
├── src/
├── node_modules/   ❌ Ignored
├── .git/           ❌ Ignored
└── .env            ❌ Ignored
```

---

## Why You Need a `.dockerignore`

### 🚀 Faster Builds

Prevents Docker from transferring unnecessary files.

Examples:

- `node_modules/`
- `vendor/`
- Large datasets
- Build artifacts

---

### 🔒 Better Security

Prevents sensitive files from ending up inside images.

Examples:

- `.env`
- SSH Keys
- SSL Certificates
- `.git`

---

### ⚡ Better Layer Caching

Temporary files change frequently.

Without `.dockerignore`, these files continuously invalidate Docker's cache.

---

## Example `.dockerignore`

```gitignore
.git
.gitignore

node_modules
vendor

.env

docker-compose*

npm-debug.log

*.md
```

---

# 6. Runtime Execution: `CMD` vs `ENTRYPOINT`

Both instructions define what a container executes when it starts.

Although they look similar, they have **different purposes**.

| Instruction | Purpose |
|------------|---------|
| `ENTRYPOINT` | Defines the executable |
| `CMD` | Defines the default arguments |

---

## `ENTRYPOINT`

Defines the **main executable** of the container.

Think of it as the container's identity.

Examples:

- nginx
- php-fpm
- mysqld
- python

```Dockerfile
ENTRYPOINT ["python3"]
```

---

## `CMD`

Provides **default arguments** to the executable.

```Dockerfile
ENTRYPOINT ["ping"]
CMD ["localhost"]
```

Running:

```bash
docker run my-ping
```

executes

```bash
ping localhost
```

while

```bash
docker run my-ping 1.1.1.1
```

executes

```bash
ping 1.1.1.1
```

The command-line argument replaces only the `CMD`.

---

## Combining `ENTRYPOINT` and `CMD`

```
ENTRYPOINT + CMD
        │
        ▼
Executable + Default Arguments
```

This is the recommended pattern for production images.

---

# Shell Form vs Exec Form

Docker supports two syntaxes.

---

## Shell Form

```Dockerfile
CMD python3 app.py
```

Internally Docker executes:

```bash
/bin/sh -c "python3 app.py"
```

Process tree:

```text
PID 1
└── /bin/sh
      │
      ▼
  python3 app.py
```

### Problems

- Shell becomes PID 1
- Signals stop at `/bin/sh`
- Slow shutdown
- Docker eventually sends `SIGKILL`

```
docker stop

      │
      ▼

SIGTERM

      │

 /bin/sh

      │

 ❌ Python never receives signal
```

---

## Exec Form ✅

```Dockerfile
CMD ["python3", "app.py"]
```

Docker executes:

```text
exec python3 app.py
```

Process tree:

```text
PID 1

python3 app.py
```

Advantages:

- Direct execution
- Receives signals immediately
- Graceful shutdown
- Better container behavior

---

## Comparison

| Shell Form | Exec Form |
|------------|-----------|
| Uses `/bin/sh` | Direct execution |
| Shell is PID 1 | Application is PID 1 |
| Poor signal forwarding | Proper signal handling |
| Slower shutdown | Graceful shutdown |
| Not recommended | ✅ Recommended |

---

# 7. Multi-Stage Builds

Traditional Docker images include:

- Compiler
- SDK
- Build tools
- Source code
- Runtime

This makes production images unnecessarily large.

Multi-stage builds separate the **build environment** from the **runtime environment**.

---

## Architecture

```text
             Builder Stage

FROM golang

Compile Application

        │
        ▼

Copy Binary

        │

        ▼

            Runtime Stage

FROM alpine

Only executable
```

---

## Benefits

- Smaller images
- Faster downloads
- Better security
- Fewer vulnerabilities

---

## Example

```Dockerfile
# ================================
# Builder
# ================================

FROM golang:1.22-alpine AS builder

WORKDIR /src

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux \
    go build \
    -o /bin/app \
    ./cmd/main.go

# ================================
# Runtime
# ================================

FROM alpine:3.19

WORKDIR /app

COPY --from=builder /bin/app .

EXPOSE 8080

USER nobody

ENTRYPOINT ["./app"]
```

---

## Why Multi-Stage Builds Matter

### 📦 Smaller Images

Instead of shipping:

- Go compiler
- SDK
- Package manager
- Source code

only the final executable is included.

Example:

| Traditional | Multi-stage |
|-------------|------------:|
| ~650 MB | ~15 MB |

---

### 🔒 Better Security

Attackers cannot use:

- gcc
- make
- git
- package managers

because they simply do not exist inside the runtime image.

---

# 8. Advanced BuildKit Features

Modern Docker uses **BuildKit** as its build engine.

It provides powerful features that improve performance and security.

---

## ⚡ Cache Mounts

Normally, package managers download dependencies every build.

BuildKit allows persistent cache directories.

Example:

```Dockerfile
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && \
    apt-get install -y nginx php-fpm
```

Benefits:

- Faster builds
- Less network traffic
- Cached package downloads

---

## 🔑 Secret Mounts

Never copy secrets into image layers.

❌ Bad

```Dockerfile
COPY id_rsa /root/.ssh/
```

or

```Dockerfile
ENV TOKEN=my-secret
```

Secrets become permanently embedded in image history.

---

### Correct Method

```Dockerfile
RUN --mount=type=secret,\
id=my-ssh-key,\
target=/root/.ssh/id_rsa \
git clone git@github.com:user/private-repo.git
```

BuildKit mounts the secret temporarily:

```
Host Secret

      │

Temporary tmpfs Mount

      │

RUN command

      │

Automatically Removed
```

The secret:

- never enters the image
- never appears in image history
- disappears after the `RUN` instruction completes

---

# 📌 Summary

| Concept | Purpose |
|---------|---------|
| Build Context | Files sent to Docker daemon |
| `.dockerignore` | Excludes unnecessary files |
| `CMD` | Default command arguments |
| `ENTRYPOINT` | Main executable |
| Shell Form | Uses `/bin/sh` (not recommended) |
| Exec Form | Direct execution (recommended) |
| Multi-stage Build | Separates build and runtime |
| BuildKit Cache | Faster rebuilds |
| BuildKit Secrets | Secure access to credentials |

---

# 💡 Dockerfile Best Practices

- Use a `.dockerignore` file.
- Keep the build context as small as possible.
- Prefer the **Exec Form** over the Shell Form.
- Combine `ENTRYPOINT` with `CMD`.
- Use multi-stage builds for production.
- Run containers as a non-root user whenever possible.
- Remove package caches after installation.
- Use BuildKit cache mounts to speed up builds.
- Never store secrets using `COPY` or `ENV`.