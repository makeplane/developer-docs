---
title: Docker AIO (All-in-One)
description: Run Plane Commercial Edition as a single all-in-one container against your own PostgreSQL, Redis, RabbitMQ, and S3-compatible storage. Environment variables, volumes, verification, and next steps.
keywords: plane docker aio, plane all-in-one container, single container plane, plane-aio-commercial, plane docker run, self-hosting
---

# Docker AIO (All-in-One) <EditionBadge edition="commercial" />

::: info Edition availability
Commercial Edition only. The image is `makeplane/plane-aio-commercial`, tagged per release (current: `%%COMMERCIAL_VERSION%%`). For a single-machine install that also runs its own database and storage, use [Docker Compose](/self-hosting/methods/docker-compose) instead.
:::

The AIO image runs every Plane application service (web, spaces, admin, API, workers, live collaboration, integrations, license monitor, email intake, proxy) inside one container, supervised by `supervisord`. It does not include a database or storage. You provide PostgreSQL, Redis, RabbitMQ, and an S3-compatible bucket. Use it on platforms that run one container per app, or on hosts where you already operate those services.

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). For AIO you need the following, reachable from the container:

- **PostgreSQL** 15.7+ or 16 with an empty database and a user that owns it
- **Redis** or Valkey 7.2+
- **RabbitMQ** 3.13+ with a vhost and user
- An **S3-compatible bucket** (AWS S3, MinIO, GCS interoperability, and so on) with credentials and a [CORS policy](/self-hosting/govern/database-and-storage) for your Plane origin

You also need Docker Engine 24+, port **80** free (and 443 if you terminate TLS in front), a domain whose DNS record points at the host, and 2 vCPU / 4 GB RAM for the container.

::: warning Don't use `localhost` in the connection URLs
Inside the container, `localhost` is the container itself. Use hostnames or IPs the container can reach. If the services run on the same host, use the host's LAN IP or `host.docker.internal` (Docker Desktop).
:::

## Install

1. Pull the image for the release you want:

   ```bash
   docker pull makeplane/plane-aio-commercial:%%COMMERCIAL_VERSION%%
   ```

2. Generate a machine signature once and keep it. The license monitor binds licenses to it, and it must stay the same across container restarts:

   ```bash
   openssl rand -hex 16   # save this value
   ```

3. Start the container. Every `-e` below is required unless marked optional. Bind-mount the volumes so that data, logs, and license state survive container replacement.

   ```bash
   docker run -d --name plane-aio --restart unless-stopped \
     -p 80:80 \
     -e DOMAIN_NAME=<your-domain> \
     -e MACHINE_SIGNATURE=<value from step 2> \
     -e DATABASE_URL=postgresql://plane:<password>@db.internal:5432/plane \
     -e REDIS_URL=redis://cache.internal:6379 \
     -e AMQP_URL=amqp://plane:<password>@mq.internal:5672/plane \
     -e AWS_REGION=us-east-1 \
     -e AWS_ACCESS_KEY_ID=<access key> \
     -e AWS_SECRET_ACCESS_KEY=<secret key> \
     -e AWS_S3_BUCKET_NAME=plane-uploads \
     -e AWS_S3_ENDPOINT_URL=https://s3.us-east-1.amazonaws.com \
     -e SECRET_KEY="$(openssl rand -hex 32)" \
     -e LIVE_SERVER_SECRET_KEY="$(openssl rand -hex 32)" \
     -v /srv/plane/data:/app/data \
     -v /srv/plane/logs:/app/logs \
     -v /srv/plane/monitor:/app/monitor \
     makeplane/plane-aio-commercial:%%COMMERCIAL_VERSION%%
   ```

   For an IP-only trial, set `DOMAIN_NAME=203.0.113.10`. For HTTPS through your own proxy, add `-e APP_PROTOCOL=https` so that generated links use `https`. The container validates the required variables at start and prints each missing one.

4. Watch it start:

   ```bash
   docker logs -f plane-aio
   docker exec -it plane-aio supervisorctl status   # every program RUNNING; migrator EXITED is normal
   ```

## Verify

Open `http://<your-domain>` (or the IP). You should see the sign-in page. You can't sign in yet. Create the instance admin first ([After you install](/self-hosting/methods/after-install)).

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**, starting with `http://<your-domain>/god-mode/`. TLS for the AIO container is normally handled by a reverse proxy or load balancer in front of it ([External reverse proxy](/self-hosting/govern/reverse-proxy)). The bundled Caddy serves plain HTTP on port 80.

::: tip Purchased a plan? Activate your license
Copy the license key from the [Prime portal](https://prime.plane.so/licenses). Sign in with the email you used to purchase.

- **Pro or Business:** in the app, go to **Workspace settings → Billing and plans → Activate this workspace**, paste the key, and click **Activate**. Each key activates one workspace. [Steps](/self-hosting/manage/manage-licenses/activate-pro-and-business#activate-your-license).
- **Enterprise Grid:** open **God Mode → Billing**, paste the key, and click **Activate**. It covers every workspace on the instance. [Steps](/self-hosting/manage/manage-licenses/activate-enterprise).

The instance needs outbound access to `prime.plane.so` to validate the license. Without a license, Plane runs on the Free plan. See [plans and pricing](https://plane.so/pricing).
:::

## Volumes

| Mount            | Contents                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `/app/data`      | Application data written by the services                                                                                                |
| `/app/logs`      | Access and error logs for every service (`/app/logs/access/`, `/app/logs/error/`)                                                       |
| `/app/monitor`   | The license monitor's database. **Must persist**, otherwise workspace and instance license state is lost when the container is replaced |
| `/app/email/tls` | Optional: TLS certificate and key for the intake email server (`TLS_CERT_PATH`, `TLS_PRIV_KEY_PATH`)                                    |

## Environment variables

Required: `DOMAIN_NAME`, `DATABASE_URL`, `REDIS_URL`, `AMQP_URL`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`.

Strongly recommended: `MACHINE_SIGNATURE` (auto-generated on each start if unset, which breaks license binding across restarts), `SECRET_KEY`, `LIVE_SERVER_SECRET_KEY`, `SILO_HMAC_SECRET_KEY`, `AES_SECRET_KEY`. The image ships public defaults for these four secrets. Replace them.

| Variable                                                                                                  | Default                                              | Purpose                                                                                                                                                                        |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `APP_PROTOCOL`                                                                                            | `http`                                               | Protocol used to build `WEB_URL`. Set `https` when a proxy terminates TLS.                                                                                                     |
| `SITE_ADDRESS`                                                                                            | `:80`                                                | Bind address of the internal Caddy proxy.                                                                                                                                      |
| `AWS_S3_ENDPOINT_URL`                                                                                     | `https://s3.<AWS_REGION>.amazonaws.com`              | S3 endpoint. Set it for MinIO or other providers.                                                                                                                              |
| `FILE_SIZE_LIMIT`                                                                                         | `5242880`                                            | Maximum upload size in bytes.                                                                                                                                                  |
| `API_KEY_RATE_LIMIT`                                                                                      | `60/minute`                                          | Throttle for API-key requests.                                                                                                                                                 |
| `ENABLE_PLANE_AI` + `PLANE_PI_DATABASE_URL`                                                               | `0`                                                  | Start the Plane AI services (needs a second PostgreSQL database).                                                                                                              |
| `ENABLE_RUNNER`                                                                                           | `0`                                                  | Start the runner service for agents.                                                                                                                                           |
| `INTAKE_EMAIL_DOMAIN`, `LISTEN_SMTP_PORT_25/465/587`, `SMTP_DOMAIN`, `TLS_CERT_PATH`, `TLS_PRIV_KEY_PATH` | `intake.<DOMAIN_NAME>`, `20025`/`20465`/`20587`, ... | Intake email server. Publish the SMTP ports (`-p 20025:20025 -p 20465:20465 -p 20587:20587`) only if you use [intake email](/self-hosting/govern/configure-dns-email-service). |
| `GITHUB_*`, `GITLAB_*`, `SLACK_*`, `INTEGRATION_CALLBACK_BASE_URL`                                        | empty                                                | Integration credentials. See [Integrations](/self-hosting/govern/integrations/github).                                                                                         |

## Manage the container

```bash
docker logs -f plane-aio                              # all services
docker exec -it plane-aio supervisorctl status        # per-service status
docker exec -it plane-aio supervisorctl restart api   # restart one service
docker stop plane-aio && docker rm plane-aio          # then docker run again with the new tag to upgrade
```

The data lives in your external services and the bind mounts, so upgrading is: pull the new tag, stop and remove the container, and run it again with the same environment and volumes.

## Troubleshoot

- **The container exits and lists `❌ '<KEY>' is not set`.** A required variable is missing.
- **`DOMAIN_NAME is not a valid FQDN or IP address`.** Use a bare hostname or IP, without `https://`.
- **Migrator or API can't connect.** A URL points at `localhost`, credentials are wrong, or a firewall blocks the container's egress.
- **Licenses reset after restarting the container.** `/app/monitor` wasn't persisted, or `MACHINE_SIGNATURE` changed.
- More: [Troubleshoot](/self-hosting/troubleshoot/overview).
