# Docker Engine Installation & Verification Guide (Debian)

This document provides a step-by-step breakdown of how the Docker Engine was installed, configured, and tested on our fresh Debian VM. Each command run during the setup is thoroughly explained to serve as a reference for both documentation and 42 project evaluations.

## Phase 1: Setting up the Repository

Before installing Docker, we must configure Debian's package manager (apt) to trust and fetch packages from the official Docker repository instead of using outdated distro-maintained sources.

**1. Install Initial Prerequisites**

```bash
sudo apt install ca-certificates curl
```

> [!NOTE]
> Why? * ca-certificates: Allows the system to verify the authenticity of SSL/TLS certificates when connecting to secure sites (like downloading Docker over HTTPS).

curl: A command-line tool used to transfer data from or to a server. We use it to download Docker's security keys.

**2. Create the Keyring Directory**

```bash
sudo install -m 0755 -d /etc/apt/keyrings
```

> [!NOTE]
> Why? * Rather than using mkdir, the install command creates the directory `/etc/apt/keyrings` and directly assigns specific access permissions to it in one step.

-m 0755: Sets the directory permissions so the owner has full read/write/execute rights, while others can read and execute.

-d: Tells the command to create a directory.

**3. Download Docker's GPG Key**

```bash
sudo curl -fsSL [https://download.docker.com/linux/debian/gpg](https://download.docker.com/linux/debian/gpg) -o /etc/apt/keyrings/docker.asc
```

> [!NOTE]
> Why? * Downloads the GNU Privacy Guard (GPG) public key from Docker's servers. This key is used by apt to cryptographically verify that the packages we download are official, untampered Docker binaries.

`-fsSL`:

`-f`: Fail silently on server errors.

`-s`: Silent mode (suppress progress meter).

`-S`: Show errors if it fails.

`-L`: Follow redirects.

`-o`: Writes the output to the specified file `(/etc/apt/keyrings/docker.asc)`.

**4. Make the GPG Key Readable**

```bash
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

> [!NOTE]
> Why? * `chmod a+r`: Adds read permission (r) for all (a) users, ensuring that the package manager can read the GPG key during updates.

**5. Write the Repository Configuration File**

```bash
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: [https://download.docker.com/linux/debian](https://download.docker.com/linux/debian)
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

> [!NOTE]
> Why? * Writes a modern, structured .sources configuration file telling apt where to look for Docker packages.

sudo tee: Reads standard input and writes it to both standard output and the specified file `(/etc/apt/sources.list.d/docker.sources)`.

`$(. /etc/os-release && echo "$VERSION_CODENAME")`: Dynamically inserts your current Debian version code name (which was resolved to trixie).

`$(dpkg --print-architecture)`: Dynamically inserts your hardware architecture (resolved to amd64).

Signed-By: Tells apt to authenticate this repository specifically using the GPG key we downloaded in Step 3.

**6. Update the Package Database**

```bash
sudo apt update
```

> [!NOTE]
> Why? * Refreshes the local package index database so apt is aware of the newly added official Docker repository and its available packages.

## Phase 2: Installing Docker Engine

**7. Install the Docker Components**

```bash
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

> [!NOTE]
> Why? This installs the entire modern containerization engine:

`docker-ce`: The core Docker Community Edition daemon (dockerd), which handles container management.

`docker-ce-cli`: The command-line interface tool (docker) that allows you to talk to the daemon.

`containerd.io`: The industry-standard container runtime supervisor that manages image downloads, storage, and execution layers.

`docker-buildx-plugin`: A powerful CLI extension for building images with advanced capabilities (like multi-platform builds).

`docker-compose-plugin`: Provides the native docker compose command for orchestrating multi-container systems (crucial for Inception!).

**8. Verify the Service Status**

```bash
sudo systemctl status docker
```

> [!NOTE]
> Why? * Uses systemctl (systemd's controller) to verify that the background daemon (dockerd) is loaded, enabled (will start automatically on boot), and active (running).

## Phase 3: Post-Install Configuration (Non-Root Privileges)

By default, the Docker daemon binds to a Unix socket (/var/run/docker.sock) owned by user root. Running commands as a regular user requires these steps to avoid typing sudo every time.

**9. Verify or Create the Group**

```bash
sudo groupadd docker
```

> [!NOTE]
> Why? * Attempts to create a system group named docker. (On modern installations, this is automatically created during package installation).

**10. Add User to the Group**

```bash
sudo usermod -aG docker $USER
```

> [!NOTE]
> Why? * usermod: Modifies a user's system account settings.

`-aG`: Appends (-a) the user to the supplementary group (-G) without removing them from their existing groups.

`$USER`: Environment variable representing your current user name (abnsila).

**11. Refresh Group Membership**

```bash
newgrp docker
```

> [!NOTE]
> Why? * Normally, group changes require logging out and back in to take effect. newgrp log you into the docker group immediately in your current shell session, making the permission changes instant.

## Phase 4: Verification & Cleanup

**12. Run the Verification Container**

```bash
docker run hello-world
```

> [!NOTE]
> Why? * Instructs the Docker CLI to check for a local image called hello-world.

Since it's not found locally, the daemon automatically queries Docker Hub, pulls down the lightweight image, creates a container, executes its process (which prints the message to your screen), and exits.

**13. Clean Up Suspended Containers**

```bash
docker rm $(docker ps -a -q)
```

> [!NOTE]
> Why? * Cleans up your system by removing the exited hello-world container.

`docker ps -a -q`:

`-a`: Lists all containers (active and stopped).

`-q`: "Quiet" mode, returning only the container IDs.

`docker rm`: Deletes the container IDs returned by the nested command.
