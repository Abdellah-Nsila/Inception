# 🌐 Docker Networking
> **Architectures, Plumbing, and Management**

This document provides a deep dive into Docker's networking subsystem, explaining both the high-level Docker networking model and the underlying Linux networking primitives that make container communication possible.

---

# 📚 Table of Contents

- [1. Under the Hood: Linux Networking Plumbing](#1-under-the-hood-linux-networking-plumbing)
- [2. Virtual Network Interfaces](#2-virtual-network-interfaces)
- [3. Docker Network Drivers](#3-docker-network-drivers)
- [4. Network Driver Comparison](#4-network-driver-comparison)
- [5. Docker Network Management](#5-docker-network-management)

---

# 1. Under the Hood: Linux Networking Plumbing

Every Docker container has its own **Network Namespace**.

A network namespace provides:

- Network interfaces
- Routing table
- Firewall rules
- ARP table
- IP addresses

To the container, it appears as if it owns an independent network card.

Docker builds this virtual network using Linux networking primitives such as:

- Network Namespaces
- Virtual Ethernet (veth) pairs
- Linux Bridge (`docker0`)
- Routing tables
- NAT (iptables)

---

## Docker Network Topology

```text
                    HOST NETWORK NAMESPACE
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   Physical NIC                     Docker Bridge             │
│    enp0s3                           docker0                  │
│       │                                 │                   │
│       │                                 │                   │
│       │                           ┌─────┴─────┐             │
│       │                           │   Bridge  │             │
│       │                           └─────┬─────┘             │
│       │                                 │                   │
│                 ┌───────────────────────┼────────────────┐   │
│                 │                       │                │   │
│             Host vethA             Host vethB      Host vethC
└─────────────────┬───────────────────────┬────────────────┬───┘
                  │                       │                │
             Container 1             Container 2      Container 3
             ┌──────────┐            ┌──────────┐     ┌──────────┐
             │  eth0    │            │  eth0    │     │  eth0    │
             └──────────┘            └──────────┘     └──────────┘
```

---

# 2. Virtual Network Interfaces

## 🔁 Loopback Interface (`lo`)

The loopback interface is a virtual network device used for local communication.

**Characteristics**

- Exists inside every network namespace
- Uses IP address `127.0.0.1`
- Never leaves the namespace
- Extremely fast (kernel memory only)

```
Application
     │
127.0.0.1
     │
     ▼
Same Process Namespace
```

---

## 🔌 Virtual Ethernet Pair (`veth`)

A **veth pair** is a virtual Ethernet cable.

It is always created in pairs.

```
Host Side                Container Side
────────────             ───────────────
veth1a2b3c  <────────>      eth0
```

Anything entering one side instantly exits the other.

Docker:

- places one end inside the container
- connects the other end to the bridge

---

## 🌐 Ethernet Interfaces (`eth0`, `eth1`, ...)

Inside every container:

```
eth0
```

is actually one end of a **veth pair**.

If a container joins multiple networks:

```
eth0
eth1
eth2
```

Docker automatically creates additional interfaces.

---

## 🌉 Docker Bridge (`docker0`)

The default bridge is a Linux software switch.

```
          docker0
      ┌──────────────┐
      │              │
      │   Bridge     │
      │              │
      └──┬────┬────┬─┘
         │    │    │
      veth  veth  veth
         │    │    │
       C1    C2    C3
```

Responsibilities:

- Switches Ethernet frames
- Assigns gateway
- Connects containers
- Performs forwarding

Typical IP:

```
172.17.0.1
```

Typical subnet:

```
172.17.0.0/16
```

---

# 3. Docker Network Drivers

Docker supports several networking drivers.

---

## 🌐 Bridge Driver (`bridge`)

The default networking mode.

Containers receive private IP addresses.

```
Internet
    │
Host
    │
docker0
 ├──────── Container A
 ├──────── Container B
 └──────── Container C
```

### Default Bridge

Characteristics:

- Uses `docker0`
- Dynamic IP allocation
- Communication via IP address
- No automatic DNS resolution

Example:

```bash
docker run nginx
```

---

### User-Defined Bridge

Docker creates a dedicated bridge.

Example:

```bash
docker network create web-network
```

Benefits:

- Automatic DNS
- Container name resolution
- Better isolation
- Independent subnet

Example communication:

```text
wordpress
      │
      ▼
mysql:3306
```

instead of

```text
172.18.0.2:3306
```

---

## 🖥 Host Driver (`host`)

The container shares the host network namespace.

```
Container
      │
      ▼
Host Network Stack
      │
      ▼
Internet
```

Characteristics:

- No NAT
- No virtual bridge
- No private IP
- Maximum performance

Example:

```bash
docker run --network host nginx
```

If nginx listens on port 80:

```
Host:80
```

is occupied directly.

### Pros

- Fastest networking
- No NAT overhead

### Cons

- No isolation
- Port conflicts
- Reduced security

---

## 🚫 None Driver (`none`)

Completely disables networking.

Container contains only:

```
lo
```

No:

- eth0
- internet
- bridge
- gateway
- DNS

Example:

```bash
docker run --network none alpine
```

Ideal for:

- Cryptography
- Offline computation
- Secure batch jobs
- Processing sensitive data

---

# 4. Network Driver Comparison

| Feature | Default Bridge | User Bridge | Host | None |
|----------|----------------|-------------|------|------|
| IP Address | Private | Private | Host IP | Loopback Only |
| DNS Resolution | ❌ | ✅ Container Name | Host DNS | ❌ |
| Internet Access | ✅ NAT | ✅ NAT | ✅ Direct | ❌ |
| Container Communication | Same bridge | Same custom bridge | Host network | ❌ |
| Port Mapping Required | ✅ | ✅ | ❌ | ❌ |
| Isolation | Medium | High | None | Maximum |

---

# 5. Docker Network Management

Docker provides the `docker network` command for managing networks.

---

## 🆕 Create

Create a user-defined bridge.

```bash
docker network create \
    --driver bridge \
    web-tier
```

Create a custom subnet.

```bash
docker network create \
    --driver bridge \
    --subnet=192.168.10.0/24 \
    --gateway=192.168.10.1 \
    secure-db-tier
```

### Subnet Calculation

```
/24

32 - 24 = 8 host bits

2⁸ = 256 addresses

Usable:

256 - 2 = 254 hosts
```

---

## 📖 Read

List available networks.

```bash
docker network ls
```

Inspect a network.

```bash
docker network inspect secure-db-tier
```

Example output includes:

- subnet
- gateway
- connected containers
- driver
- labels

---

## 🔄 Update

Attach a running container.

```bash
docker network connect \
    secure-db-tier \
    my-app-container
```

Assign a static IP.

```bash
docker network connect \
    --ip 192.168.10.100 \
    secure-db-tier \
    database-container
```

Disconnect a container.

```bash
docker network disconnect \
    secure-db-tier \
    my-app-container
```

Docker performs these operations **without restarting the container**.

---

## 🗑 Delete

Remove a network.

```bash
docker network rm secure-db-tier
```

A network must have **no attached containers** before it can be removed.

Clean all unused networks.

```bash
docker network prune
```

---

# 📌 Summary

| Component | Description |
|-----------|-------------|
| **Network Namespace** | Isolated network stack for a container |
| **veth Pair** | Virtual Ethernet cable connecting host and container |
| **docker0** | Default Linux bridge |
| **Bridge Driver** | Default isolated private network |
| **User Bridge** | Custom bridge with automatic DNS |
| **Host Driver** | Shares host networking |
| **None Driver** | Completely disables networking |
| **docker network** | CLI used to manage Docker networks |

---

# 🧠 Networking Workflow

```text
                 docker run

                      │

                      ▼

          Create Network Namespace

                      │

                      ▼

           Create Virtual Ethernet Pair

                      │

                      ▼

     Host veth ───────────── Container eth0

                      │

                      ▼

           Connect to docker0 Bridge

                      │

                      ▼

           Assign Private IP Address

                      │

                      ▼

              Configure Routing

                      │

                      ▼

          Container Can Reach Network
```