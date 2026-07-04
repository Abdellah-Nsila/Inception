## Docker Compose — The Conductor

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