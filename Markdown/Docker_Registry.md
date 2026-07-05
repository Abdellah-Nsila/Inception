# 🐳 Docker Registry, Repository & Image Management

> A comprehensive reference for understanding how Docker images are stored, versioned, distributed, and managed across local machines and remote registries.

This guide covers:

- Docker Registries
- Repositories
- Image Tags
- Image References
- Image Management Commands
- Pull & Push Internals
- Production Best Practices

---

# 📚 Table of Contents

- [1. Registries & Repositories](#1-registries--repositories)
- [2. Image Reference Anatomy](#2-image-reference-anatomy)
- [3. Docker CLI Reference](#3-docker-cli-reference)
- [4. How Pull & Push Work](#4-how-pull--push-work)
- [5. Registry Best Practices](#5-registry-best-practices)

---

# 1. Registries & Repositories

Docker stores images using a hierarchical structure.

```
                    Docker Registry

┌──────────────────────────────────────────────────────┐
│ registry.hub.docker.com                              │
│                                                      │
│   Repository: alpine                                │
│      ├── 3.19                                       │
│      ├── 3.20                                       │
│      └── latest                                     │
│                                                      │
│   Repository: debian                               │
│      ├── bookworm                                  │
│      ├── bullseye                                  │
│      └── latest                                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Registry

A **Docker Registry** is a remote service responsible for storing and distributing Docker images.

Think of it as a library containing thousands of container images.

Examples:

- Docker Hub
- GitHub Container Registry (GHCR)
- Amazon ECR
- Azure Container Registry
- Self-hosted Registry

---

## Public Registries

Anyone can pull images.

Examples:

```text
docker.io
```

Official images:

- nginx
- alpine
- debian
- mariadb
- redis

Example:

```bash
docker pull alpine:3.19
```

---

## Private Registries

Private registries protect proprietary images.

Common examples:

- GitHub Container Registry
- Amazon ECR
- Azure Container Registry
- Self-hosted Registry

Typical uses:

- Company applications
- Academic projects
- Internal CI/CD pipelines

---

## Repository

A repository stores multiple versions of the same image.

Example:

```
Repository

nginx

├── latest
├── 1.25
├── 1.26
└── alpine
```

Each version is identified by a **tag**.

---

## Tag

A tag is a human-readable version label.

Example:

```text
nginx:latest
nginx:1.26
alpine:3.19
debian:bookworm
```

If no tag is specified:

```bash
docker pull nginx
```

Docker automatically assumes:

```text
nginx:latest
```

---

# 2. Image Reference Anatomy

Every Docker image has a complete reference.

```
[Registry]/[Namespace]/[Repository]:[Tag]
```

Example:

```
ghcr.io/abnsila/custom-nginx:1.0-alpine
```

Diagram:

```
ghcr.io / abnsila / custom-nginx : 1.0-alpine

    │         │           │              │
    │         │           │              └── Tag
    │         │           └──────────────── Repository
    │         └──────────────────────────── Namespace
    └────────────────────────────────────── Registry
```

---

## Registry

The registry hostname.

Example:

```
ghcr.io
```

If omitted:

```text
docker.io
```

is used automatically.

---

## Namespace

The user or organization owning the repository.

Example:

```
abnsila
```

Official Docker images use:

```
library
```

Example:

```
docker.io/library/nginx
```

which can simply be written as

```bash
docker pull nginx
```

---

## Repository

The repository identifies the application.

Examples:

```
nginx
wordpress
mariadb
custom-nginx
```

---

## Tag

Tags identify image versions.

Examples:

```
latest
bookworm
3.19
1.0-alpine
```

---

# 3. Docker CLI Reference

## Registry Commands

| Command | Description |
|----------|-------------|
| `docker login` | Authenticate to a registry |
| `docker logout` | Logout from registry |
| `docker pull` | Download an image |
| `docker push` | Upload an image |
| `docker search` | Search Docker Hub |

Examples:

```bash
docker login ghcr.io

docker pull alpine:3.19

docker push ghcr.io/abnsila/server:1.0
```

---

## Local Image Management

### Tag an Image

Before pushing an image, it must reference its destination repository.

```bash
docker tag local-app:latest \
ghcr.io/abnsila/prod-server:1.0
```

---

### List Images

```bash
docker images
```

Displays:

- Repository
- Tag
- Image ID
- Creation date
- Size

---

### Inspect an Image

```bash
docker inspect alpine:3.19
```

Returns JSON containing:

- Environment variables
- Layers
- Labels
- Entrypoint
- Metadata

---

### View Layer History

```bash
docker history alpine:3.19
```

Shows:

- Dockerfile instructions
- Layer sizes
- Build history

---

### Remove an Image

```bash
docker rmi ghcr.io/abnsila/server:1.0
```

The image cannot be removed while containers still reference it.

---

### Remove Unused Images

```bash
docker image prune -a
```

Removes:

- Dangling images
- Unused images
- Intermediate build layers

---

# 4. How Pull & Push Work

Docker does **not** transfer an image as one large file.

Instead, it follows the **OCI Distribution Specification** and transfers images layer by layer.

```
Local Docker Engine

        │

Request Manifest

        │

        ▼

Docker Registry

        │

Return Manifest

        │

SHA256 Layer Hashes

        │

        ▼

Compare Local Cache

        │

Missing Layers

        │

        ▼

Download Only Missing Layers
```

---

## Step 1 — Retrieve Manifest

Docker first downloads the **Manifest**.

The manifest contains:

- Layer hashes
- Configuration
- Metadata
- Image digest

Example:

```
Manifest

Layer A

Layer B

Layer C
```

---

## Step 2 — Deduplication

Docker compares every layer hash against the local cache.

```
Registry

Layer A

Layer B

Layer C


Host

Layer A ✔

Layer B ✔

Layer C ❌
```

Only missing layers are downloaded.

This dramatically reduces bandwidth.

---

## Step 3 — Blob Download

Missing layers are downloaded in parallel.

```
Layer A ✔ Cached

Layer B ✔ Cached

Layer C Download

Layer D Download
```

This makes Docker downloads much faster.

---

# 5. Registry Best Practices

## 🚫 Avoid `latest`

Avoid:

```text
nginx:latest
```

Use explicit versions instead.

Preferred:

```text
nginx:1.26

debian:bookworm-slim

alpine:3.19
```

Pinned versions guarantee reproducible builds.

---

## 🔒 Secure Authentication

Never store registry passwords inside:

- Dockerfiles
- Shell scripts
- Environment variables

Prefer:

- Access Tokens
- Credential Helpers
- Secret Managers

---

## 🧹 Clean Up Images

Docker builds create intermediate images.

Regular cleanup prevents disk exhaustion.

Example:

```bash
docker image prune -a
```

Useful inside Makefiles:

```Makefile
clean:
	docker image prune -a -f
```

---

# 📌 Summary

| Component | Description |
|-----------|-------------|
| **Registry** | Stores Docker images |
| **Repository** | Collection of related image versions |
| **Tag** | Human-readable version |
| **Image Reference** | Complete image address |
| **docker pull** | Download image |
| **docker push** | Upload image |
| **docker tag** | Rename or prepare an image for a registry |
| **docker history** | Display image build history |
| **docker inspect** | View image metadata |
| **docker image prune** | Remove unused images |

---

# 🔄 Docker Image Lifecycle

```text
Dockerfile
      │
docker build
      │
      ▼
Local Image
      │
docker tag
      │
      ▼
Repository Reference
      │
docker push
      │
      ▼
Docker Registry
      │
docker pull
      │
      ▼
Another Host
      │
docker run
      ▼
Running Container
```