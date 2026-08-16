---
title: Docker Compose (Community Edition)
description: Install the open-source Plane Community Edition with Docker Compose using setup.sh. Download the installer, configure plane.env, start the services, and verify.
keywords: plane community edition docker, setup.sh, plane docker compose install, plane self-host free, plane.env, plane-app
---

# Docker Compose <EditionBadge edition="community" />

::: info Edition availability
This guide installs the open-source **Community Edition** (current release %%CE_VERSION%%) with the `setup.sh` installer from the [GitHub releases](https://github.com/makeplane/plane/releases). For the Commercial Edition (recommended, free plan included), see [Docker Compose](/self-hosting/methods/docker-compose).
:::

`setup.sh` is a menu-driven script. It downloads the Compose file and environment template for the latest release, and starts, stops, upgrades, and backs up the stack. Allow about 20 minutes: a few minutes to install, a few to edit the environment file, and the rest for images to download.

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). For the Community Edition on Docker Compose you need:

- A Linux machine (or macOS with Docker Desktop for evaluation; Windows through WSL2 or Git Bash) with **2 vCPU and 4 GB RAM** minimum, 8 GB recommended, and disk for the database and uploads if they stay local.
- **Docker Engine 24+ with the Compose v2 plugin** (`docker compose version`). Install with `curl -fsSL https://get.docker.com | sh` on Linux. Your user must be able to run Docker. `sudo su` to root is the simplest option.
- **Ports 80 and 443** free and open, or other ports set in `plane.env` (see below).
- A **domain name whose DNS record resolves to this machine** if you want automatic HTTPS. An IP address works for plain-HTTP trials.
- Outbound access to `github.com` and `api.github.com` (release lookup and downloads) and Docker Hub (images).

## Install

1. Create a folder for the installer and data, and download `setup.sh` from the latest release:

   ```bash
   mkdir plane-selfhost && cd plane-selfhost
   curl -fsSL -o setup.sh https://github.com/makeplane/plane/releases/latest/download/setup.sh
   chmod +x setup.sh
   ```

2. Run the installer and choose **Install**:

   ```bash
   ./setup.sh
   ```

   ```
   Select a Action you want to perform:
      1) Install
      2) Start
      3) Stop
      4) Restart
      5) Upgrade
      6) View Logs
      7) Backup Data
      8) Exit

   Action [2]: 1
   ```

   Install looks up the latest release, checks that images exist for your CPU architecture (AMD64 or ARM64), and downloads `docker-compose.yaml` and `plane.env` into a new `plane-app/` folder. The script then exits. That is expected. You can also run actions directly: `./setup.sh install`, `./setup.sh start`, and so on.

3. Edit `plane-app/plane.env`. The template ships with placeholder values that must be changed before the first start:

   ```bash
   # The address users will open. WEB_URL and CORS_ALLOWED_ORIGINS default to
   # http://${APP_DOMAIN}. Keep that for plain HTTP, or set https URLs when you enable TLS.
   APP_DOMAIN=<your-domain>
   WEB_URL=https://<your-domain>
   CORS_ALLOWED_ORIGINS=https://<your-domain>

   # Built-in Caddy proxy. Set your domain to get an automatic Let's Encrypt certificate
   # (ports 80/443 reachable, DNS pointing here). Use SITE_ADDRESS=:80 for plain HTTP or
   # when your own reverse proxy terminates TLS.
   SITE_ADDRESS=<your-domain>
   CERT_EMAIL=<your-email>

   # Host ports the proxy publishes. Change if 80/443 are taken.
   LISTEN_HTTP_PORT=80
   LISTEN_HTTPS_PORT=443

   # Secrets. Generate your own. The placeholders boot but log a security warning.
   SECRET_KEY=<output of: openssl rand -hex 32>
   LIVE_SERVER_SECRET_KEY=<output of: openssl rand -hex 32>

   # Credentials for the bundled services. Change them for anything but a trial.
   POSTGRES_PASSWORD=<strong password>
   RABBITMQ_PASSWORD=<strong password>
   AWS_ACCESS_KEY_ID=<minio root user>
   AWS_SECRET_ACCESS_KEY=<minio root password>
   ```

   For an IP-only trial: `APP_DOMAIN=203.0.113.10`, `WEB_URL=http://203.0.113.10`, `CORS_ALLOWED_ORIGINS=http://203.0.113.10`, `SITE_ADDRESS=:80`. Behind HTTPS (your domain or a reverse proxy), also set `MINIO_ENDPOINT_SSL=1` so that uploaded-file links use `https`. To use your own PostgreSQL, Redis, RabbitMQ, or S3, see [external services](/self-hosting/community/manage#use-external-services). Every variable is described in [Environment variables](/self-hosting/community/manage#environment-variables).

4. Start the stack:

   ```bash
   ./setup.sh start
   ```

   The script pulls the images (this takes a while on the first run), waits for the database migration to finish, waits for the API to respond, and prints `You can access the application at <WEB_URL>`.

## Verify

```bash
docker compose -f plane-app/docker-compose.yaml --env-file plane-app/plane.env ps
```

Every service should be `running`. `migrator` exits after it finishes, which is normal. Open `WEB_URL` in a browser. You should see the sign-in screen. You can't sign in yet because the instance has no administrator.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**, starting with step 1: open `<WEB_URL>/god-mode/` to create the instance admin. Then set up SMTP in **God Mode → Email** (the Community Edition configures email, OAuth, and similar settings in God Mode, not in `plane.env`), choose sign-in methods, and set up backups.

## Manage the instance

```bash
./setup.sh start      # start (or ./setup.sh, then 2)
./setup.sh stop       # stop; data volumes are kept
./setup.sh restart    # restart, for example after editing plane-app/plane.env
./setup.sh logs       # pick a service and tail its logs
./setup.sh upgrade    # download the latest release, then run start again
./setup.sh backup     # back up PostgreSQL, Redis, RabbitMQ, and MinIO data
```

Restore, external services, changing the domain, and troubleshooting are in [Manage your instance](/self-hosting/community/manage).

## Troubleshoot

- **`AMD64 images are not available for selected release`.** The release lookup or Docker Hub isn't reachable, or you are on an unsupported architecture. Check outbound access. On unusual architectures the installer offers to build images locally.
- **The proxy container restarts and the site doesn't load.** Usually `SITE_ADDRESS` is set to a domain that doesn't resolve to this machine yet, or ports 80/443 aren't reachable, so the certificate request fails. Fix DNS or set `SITE_ADDRESS=:80` for now, then run `./setup.sh restart`.
- **`plane-migrator` exited with an error.** Check `./setup.sh logs` → Migrator. Most often a `DATABASE_URL` pointing at `localhost` (inside a container that is the container itself) or wrong credentials.
- **Everything runs but pages show `localhost` links or CORS errors.** `APP_DOMAIN` is still `localhost`, or `WEB_URL`/`CORS_ALLOWED_ORIGINS` use `http://` while you serve `https://`. Fix the values and restart.
- More: [Installation errors](/self-hosting/troubleshoot/installation-errors), [Storage errors](/self-hosting/troubleshoot/storage-errors), [Discord](https://discord.gg/plane).
