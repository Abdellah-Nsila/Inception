# User Documentation: Inception Infrastructure Stack

This guide explains how to interact with, manage, and verify the multi-container web architecture provided by this stack.

---

## 1. Services Provided by the Stack

The infrastructure runs an isolated microservice architecture composed of three core mandatory components:

| Service | Technology | Role within the Stack |
| :--- | :--- | :--- |
| **Nginx** | Alpine Linux / Nginx | The sole entry point. Operates as a secure web server and reverse proxy enforcing strict TLS v1.2/v1.3 protocols. It safely routes incoming traffic over port 443 to the backend. |
| **WordPress** | Alpine Linux / PHP-FPM | The application layer hosting the WordPress website. It processes dynamic scripts and interacts directly with the database. |
| **MariaDB** | Alpine Linux / MariaDB | The relational database backend. It runs as a fully isolated service, hidden from the public internet, storing all persistent site content and user configurations. |

---

## 2. Starting and Stopping the Project

Management of the container lifecycle is abstracted through standard automation commands via the project's `Makefile`. Run these from the repository root:

*   **Start & Build the Stack:** Initializes local data host directories, evaluates credentials, builds the custom images, and launches the infrastructure in detached (background) mode.
    ```bash
    make
    ```
*   **Stop the Stack:** Safely stops all active service containers without destroying persistent application data.
    ```bash
    make down
    ```
*   **Soft Clean Up:** Tears down the containers and completely unmounts the internal networks.
    ```bash
    make clean
    ```
*   **Full Hard Clean Up:** Stops the services, strips away the internal volumes, permanently wipes the local data directories from the host filesystem, and clears out the built image cache.
    ```bash
    make fclean
    ```

---

## 3. Accessing the Website and Administration Panel

### DNS Configuration Prerequisite
The stack is mapped to a dedicated local domain variant. Before attempting to open the connection in a browser, your host operating system must know how to translate this domain name. 

Add the following translation rule to your local `/etc/hosts` file:
```text
127.0.0.1    abnsila.42.fr

```

### Access URLs

Once the routing rule is in place, you can view the live components via HTTPS:

* **Public Landing Page:** `https://abnsila.42.fr`
* **WordPress Admin Dashboard:** `https://abnsila.42.fr/wp-admin`

---

## 4. Locating and Managing Credentials

For production-grade security, this project entirely rejects passing plaintext passwords inside the standard configuration environments.

### Secure Architecture

* **Storage Location:** Raw user, admin, and database root passwords reside locally outside the public application space within the `../secrets/` directory.
* **Runtime Injection:** These credentials are dynamically provisioned into system memory at the exact millisecond the container boots up using **Docker Secrets**.
* **Why This Matters:** Because secrets are loaded out-of-band at runtime, the sensitive strings are completely absent from the source images. An attacker cannot discover your production keys by inspecting image history, extracting built layers, or viewing standard `docker inspect` environment tables.

---

## 5. Verifying Service Health

You can check that the infrastructure is performing correctly through multiple validation approaches:

### Option A: The Command Line Interface (CLI)

Run a process lookup to ensure the states are active and checking out healthy:

```bash
docker ps

```

Your MariaDB container should explicitly display `(healthy)` in the status column, confirming it passed its automated configuration integrity loop.

### Option B: Inter-Container Network Testing

To prove that the services are isolated yet properly linked inside their internal network switch, check the internal routing from Nginx back to WordPress:

```bash
docker exec nginx ping -c 3 wordpress

```

### Option C: Visual Extension Tools

If you use Visual Studio Code, open the **Docker / Dev Containers Extension**. The side panel provides a live graphical view showing the status tree of the `inception_net` network block, running active container nodes, and connected storage volume maps at a glance.