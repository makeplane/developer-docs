---
title: Configure external reverse proxy
description: Configure Nginx, Caddy, or Traefik as a reverse proxy for self-hosted Plane. Setup upstream proxying, headers, and WebSocket support.
keywords: plane reverse proxy, nginx proxy, traefik, caddy, upstream proxy, proxy configuration, self-hosting
---

# Configure external reverse proxy <Badge type="info" text="Commercial Edition" />

This page provides configuration for setting up an external reverse proxy with Plane.

## Plane environment setup

Make sure to update the following environment variables in your plane.env file.

1. Assign free ports for Plane to listen on. Update the following variables with two different unsused ports:

   ```bash
   LISTEN_HTTP_PORT=
   LISTEN_HTTPS_PORT=
   ```

2. Update the SITE_ADDRESS variable to `:80`

   ```bash
     SITE_ADDRESS=:80
   ```

   This is required so that generated links and redirects work correctly behind the proxy:

3. After editing plane.env, restart your instance so the changes take effect:
   ```bash
   sudo prime-cli restart
   ```

::: warning
**Prime CLI is for Docker installations only.** These commands only work on Plane instances originally installed using `prime-cli`.
:::

## Proxy setup

1. Choose the appropriate [configuration template](#configuration-templates) for your reverse proxy.

2. Replace the following placeholders:
   - `<domain>`  
     Your Plane application's domain name.
   - `<plane-host-ip>`  
     The IP address where Plane is hosted.
   - `<plane-host-port>`  
     The port Plane listens on.
3. For Traefik, also update `your-email@example.com` with your email.

Ensure that your reverse proxy setup follows the template provided, and that the forwarded headers and ports are correctly set to match the environment variable configuration.

## Configuration templates

All configurations include:

- Automatic HTTPS redirection
- WebSocket support
- Standard proxy headers
- SSL/TLS certificate management
  - NGINX: Uses Certbot
  - Caddy: Handles certificates automatically
  - Traefik: Uses Let’s Encrypt

::: details NGINX configuration

```bash
server {
    server_name <domain>;

    location / {
        proxy_pass http://<plane-host-ip>:<plane-host-port>/;

        # Set headers for proxied request
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP         $remote_addr;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;
        proxy_http_version 1.1;
    }

    client_max_body_size 10M;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/<domain>/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<domain>/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = <domain>) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name <domain>;
    return 404;
}
```

:::

::: details Caddy configuration

```bash
<domain> {
    tls {
        # Caddy will automatically handle certificates
    }

    redir / https://{host}{uri} permanent

    reverse_proxy <plane-host-ip>:<plane-host-port> {
        header_up X-Forwarded-Proto {scheme}
        header_up X-Forwarded-Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up Host {http.request.host}

        header_up Upgrade {http.request.header.Upgrade}
        header_up Connection {http.request.header.Connection}

        transport http {
            tls_insecure_skip_verify
            read_buffer 4096
            write_buffer 4096
        }
    }

    request_body {
        max_size 10MB
    }
}
```

:::

::: details Traefik configuration

```bash
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
          permanent: true

  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com  # Replace with your email
      storage: acme.json
      httpChallenge:
        entryPoint: web

providers:
  http:
    routers:
      plane-router:
        rule: "Host(`<domain>`)"
        service: plane-service
        entryPoints:
          - websecure
        tls:
          certResolver: letsencrypt

    services:
      plane-service:
        loadBalancer:
          servers:
            - url: "http://<plane-host-ip>:<plane-host-port>"
          passHostHeader: true
          responseForwarding:
            flushInterval: "100ms"
          serversTransport:
            maxIdleConnsPerHost: 100
            forwardingTimeouts:
              dialTimeout: 30s
              responseHeaderTimeout: 30s
              idleConnTimeout: 90s

    middlewares:
      headers:
        headers:
          customRequestHeaders:
            X-Forwarded-Proto: "https"
            X-Real-IP: "{{ .RemoteAddr }}"
```

:::

::: details Community Edition

This section provides configuration for setting up a custom external reverse proxy with Plane Community Edition. By default, Plane CE includes a bundled Caddy reverse proxy.

### 1. Disable the bundled proxy

To use your own reverse proxy, you must first disable the built-in proxy service.
Open your `docker-compose.yml` file and comment out or remove the `proxy` service at the end of the file.

### 2. Connect to the Plane Docker network

Your custom reverse proxy needs to resolve the internal container hostnames (like `web`, `api`, `admin`). The easiest way to achieve this is to run your reverse proxy container on the same Docker network as Plane (usually `plane-app_default`), or map all necessary ports from the individual containers to your host machine.

### 3. Route mapping

Plane CE relies on path-based routing to direct traffic to different services. You must map the following paths to their respective containers and internal ports:

| Route Path | Destination Container | Internal Port |
| :--- | :--- | :--- |
| `/*` (catch-all) | `web` | 3000 |
| `/spaces/*` | `space` | 3000 |
| `/god-mode/*` | `admin` | 3000 |
| `/live/*` | `live` | 3000 |
| `/api/*`, `/auth/*`, `/static/*` | `api` | 8000 |
| `/<bucket-name>/*` (default: `/uploads`) | `plane-minio` | 9000 |

### 4. Configuration templates

Below are example configurations for Nginx, Caddy, and Traefik assuming your proxy is on the same Docker network as the Plane containers.

#### NGINX configuration

```nginx
server {
    listen 80;
    server_name <domain>;

    # File uploads (MinIO)
    # Replace 'uploads' with your configured AWS_S3_BUCKET_NAME if changed
    location ~ ^/uploads(/.*)?$ {
        proxy_pass http://plane-minio:9000;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API, Auth, and Static
    location ~ ^/(api|auth|static)(/.*)?$ {
        proxy_pass http://api:8000;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Live (WebSockets)
    location /live/ {
        proxy_pass http://live:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # God mode (Admin)
    location /god-mode/ {
        proxy_pass http://admin:3000;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Spaces
    location /spaces/ {
        proxy_pass http://space:3000;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend (Catch-all)
    location / {
        proxy_pass http://web:3000;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    client_max_body_size 50M;
}
```

#### Caddy configuration

```caddy
<domain> {
    request_body {
        max_size 50MB
    }

    redir /spaces /spaces/ permanent
    reverse_proxy /spaces/* space:3000

    redir /god-mode /god-mode/ permanent
    reverse_proxy /god-mode/* admin:3000

    reverse_proxy /live/* live:3000

    reverse_proxy /api/* api:8000
    reverse_proxy /auth/* api:8000
    reverse_proxy /static/* api:8000

    # Replace 'uploads' with your actual bucket name if changed
    reverse_proxy /uploads/* plane-minio:9000
    reverse_proxy /uploads plane-minio:9000

    reverse_proxy /* web:3000
}
```

#### Traefik configuration

With Traefik, you can apply labels directly in your `docker-compose.yml` to the respective containers instead of a static configuration file. Assuming Traefik is set up to read Docker labels:

```yaml
services:
  web:
    # ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.plane-web.rule=Host(`<domain>`)"
      - "traefik.http.services.plane-web.loadbalancer.server.port=3000"

  api:
    # ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.plane-api.rule=Host(`<domain>`) && (Path(`/api`) || PathPrefix(`/api/`) || Path(`/auth`) || PathPrefix(`/auth/`) || Path(`/static`) || PathPrefix(`/static/`))"
      - "traefik.http.services.plane-api.loadbalancer.server.port=8000"

  admin:
    # ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.plane-admin.rule=Host(`<domain>`) && (Path(`/god-mode`) || PathPrefix(`/god-mode/`))"
      - "traefik.http.services.plane-admin.loadbalancer.server.port=3000"

  space:
    # ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.plane-space.rule=Host(`<domain>`) && (Path(`/spaces`) || PathPrefix(`/spaces/`))"
      - "traefik.http.services.plane-space.loadbalancer.server.port=3000"

  live:
    # ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.plane-live.rule=Host(`<domain>`) && (Path(`/live`) || PathPrefix(`/live/`))"
      - "traefik.http.services.plane-live.loadbalancer.server.port=3000"

  plane-minio:
    # ...
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.plane-minio.rule=Host(`<domain>`) && (Path(`/uploads`) || PathPrefix(`/uploads/`))"
      - "traefik.http.services.plane-minio.loadbalancer.server.port=9000"
```

:::
