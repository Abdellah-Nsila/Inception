# 🌐 Nginx Service Documentation

## 1. Nginx Server Block Configuration (`nginx.conf`)

This configuration turns Nginx into a high-performance reverse proxy that intercepts client requests, handles mandatory SSL encryption, and routes PHP files safely to the backend WordPress container.

### Server & SSL Setup

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name abnsila.42.fr;

```

* **What it does:** Binds Nginx to port `443` (HTTPS) for both IPv4 and IPv6 traffic. It tells the web server to respond exclusively to requests targeting your custom 42 evaluation domain.

```nginx
    ssl_certificate /etc/nginx/ssl/inception.crt;
    ssl_certificate_key /etc/nginx/ssl/inception.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

```

* **What it does:** Points Nginx to your generated SSL certificate and private key. To fulfill the strict security protocols of the *Inception* subject, it explicitly enforces **TLSv1.2** and **TLSv1.3** while disabling weak, legacy cryptographic algorithms like MD5.

### Webroot & Basic Routing

```nginx
    root /var/www/html;
    index index.php index.html index.htm;

```

* **What it does:** Points Nginx to the shared volume directory holding your WordPress data and defines the file evaluation hierarchy when a user looks up a directory path.

```nginx
    location /portfolio/ {
        proxy_pass http://portfolio:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
```

This block is a **Reverse Proxy**. It turns your Nginx container into a security guard and traffic cop: instead of exposing your portfolio directly to the internet on port 5173, Nginx intercepts everything on the secure port 443 (`https`) and safely passes it to the backend container.

During an evaluation defense, this is exactly what each line tells Nginx to do:

---

### 1. `location /portfolio/`

This defines the routing trigger. It tells Nginx: *"Any incoming web request whose URL starts with `[https://abnsila.42.fr/portfolio/](https://abnsila.42.fr/portfolio/)` must be handled by the rules inside these brackets."*

### 2. `proxy_pass http://portfolio:5173;`

This is the core forwarder. It redirects the request down into your private Docker network.

* **`portfolio`** is not an IP address; it is the exact service name from your `docker-compose.yml`. Nginx relies on **Docker's internal DNS server** to resolve this name into the container's private IP.
* **`5173`** is the internal port where Vite is listening.

### 3. `proxy_set_header Host $host;`

By default, a proxy rewrites the request headers. If you don't include this line, Nginx tells the backend that the request came for `http://portfolio:5173`.
By setting this header to `$host`, Nginx passes along the real domain name the user typed into their browser (`abnsila.42.fr`). As you saw earlier, Vite 6 requires this to pass its security checks.

### 4. `proxy_set_header X-Real-IP $remote_addr;`

Without this, the portfolio container thinks 100% of its traffic is coming from the Nginx container's internal network IP (e.g., `172.18.0.3`). This line grabs the client's actual public IP address and hands it to the backend container.

### 5. `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`

This handles request tracing. It builds a historical list of IP addresses. If a request passes through a load balancer, a CDN, and then Nginx, this header appends each hop in order (`Client-IP, Proxy1-IP, Proxy2-IP`). It prevents malicious users from hiding behind proxies.

### 6. `proxy_set_header X-Forwarded-Proto $scheme;`

This tells the backend what protocol the client used to connect. `$scheme` will resolve to `https`. This is vital because React or WordPress needs to know that the connection is encrypted so they can safely generate secure absolute links and cookies.

---

> **The Evaluation Takeaway:** This block allows you to keep all ports closed on your host machine except for Nginx (ports 80 and 443), perfectly honoring the structural isolation requirements of the Inception project.


```nginx
    location / {
        try_files $uri $uri/ /index.php?$args;
    }

```

* **What it does:** A safety fallback router. It checks whether a requested file or directory physically exists on disk. If it doesn't, it cleanly rewrites the internal request path over to `/index.php` along with the original request arguments. This is what enables WordPress to use clean, readable permalinks.

### PHP-FPM Gateway Integration

```nginx
    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;

```

* **What it does:** Matches any URL request ending in `.php`. The split regex isolates the true script name from any trailing path info so Nginx passes accurate file variables downstream.

```nginx
        try_files $uri =404;

```

* **What it does:** A vital security check. If a malicious actor requests a non-existent PHP file path, Nginx kills the request with an immediate **404 Not Found** instead of bothering or overloading your PHP-FPM service.

```nginx
        fastcgi_pass wordpress:9000;
        fastcgi_index index.php;
        include fastcgi_params;

```

* **What it does:** Proxies the structured request directly over the virtual network to the container service named `wordpress` on port `9000` via the FastCGI communication protocol.

```nginx
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
}

```

* **What it does:** Tells PHP-FPM the absolute physical path location of the file it needs to read and process (`/var/www/html/filename.php`) alongside its underlying execution meta-data parameters.

---

## 2. The Nginx Dockerfile Breakdown

This file handles the deployment build phase of your edge-routing web server layer.

```dockerfile
FROM alpine:3.23
RUN apk add --no-cache nginx openssl

```

* **What it does:** Uses Alpine Linux to download and install Nginx and the OpenSSL toolkit cleanly without preserving bulky internal package cache indexes.

```dockerfile
ARG DOMAIN_NAME=abnsila.42.fr

```

* **What it does:** Declares a build argument variable designed to catch values passed down dynamically by Docker Compose during image compilation.

```dockerfile
RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/inception.key \
    -out /etc/nginx/ssl/inception.crt \
    -subj "/C=MA/L=BenGuerir/O=1337/CN=${DOMAIN_NAME}"

```

* **What it does:** Creates a dedicated directory structure for security credentials and runs an automated, non-interactive OpenSSL configuration script. It outputs a self-signed **2048-bit RSA** encryption certificate valid for one year, dynamically attaching your evaluation domain name as the certificate's verified Common Name (`CN`).

```dockerfile
COPY ./conf/nginx.conf /etc/nginx/http.d/nginx.conf
EXPOSE 443
CMD [ "nginx", "-g", "daemon off;" ]

```

* **What it does:** Copies your custom server configuration block directly into Alpine's native Nginx configuration path (`/etc/nginx/http.d/`). It opens network port `443` to host traffic and leverages the JSON execution array format to lock Nginx to **PID 1** in the foreground so it stays responsive to OS signals.