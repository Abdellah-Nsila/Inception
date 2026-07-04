## Registries — The Library

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

