## 1. Images — The Blueprints

An **Image** is an immutable (read-only) template containing everything needed to run a program: application code, runtime engine, system tools, libraries, and settings.

### How Images Work

| Concept | Description |
|---|---|
| **Layered File System (UFS)** | Images are built using a Union File System. Each Dockerfile instruction (`RUN`, `COPY`, `ADD`) creates a new read-only layer. |
| **Storage Efficiency** | Layers are cached and shared. Three images built `FROM debian:bullseye` share the exact same base layers on disk — O(1) storage for shared components. |
| **Ephemeral Architecture** | When instantiated into a container, a thin writable *Container Layer* is added on top of the immutable image layers. |


### Image layers

* Each layer in an image contains a set of filesystem changes - additions, deletions, or modifications. Let’s look at a theoretical image:

-    The first layer adds basic commands and a package manager, such as apt.
-    The second layer installs a Python runtime and pip for dependency management.
-    The third layer copies in an application’s specific requirements.txt file.
-    The fourth layer installs that application’s specific dependencies.
-    The fifth layer copies in the actual source code of the application.

This example might look like:

![Image Layers](../assets/image_layers.png)

* This is beneficial because it allows layers to be reused between images. For example, imagine you wanted to create another Python application. Due to layering, you can leverage the same Python base. This will make builds faster and reduce the amount of storage and bandwidth required to distribute the images. The image layering might look similar to the following:

![Shared Image Layers](../assets/shared_image_layers.png)

### Image Commands

| Command | Description | Example |
|---|---|---|
| `docker build` | Build an image from a local Dockerfile | `docker build -t my-app:1.0 .` |
| `docker images` | List all locally cached images | `docker images` |
| `docker inspect` | Return low-level system info in JSON | `docker inspect debian:bullseye` |
| `docker history` | Show build history and layers | `docker history my-app:1.0` |
| `docker tag` | Create a tag alias pointing to a source image | `docker tag my-app:1.0 user/my-app:1.0` |
| `docker rmi` | Delete a local image | `docker rmi user/my-app:1.0` |
| `docker image prune` | Remove all dangling/unused images | `docker image prune -a` |

---