---
title: Docker Compose
description: Install Plane Commercial Edition with Docker Compose. One command installs the Prime CLI and starts the full stack on a single machine. Prerequisites, verification, and next steps.
keywords: plane docker compose, install plane docker, prime cli, plane commercial edition install, self-hosting plane, docker install
---

# Docker Compose <EditionBadge edition="commercial" />

::: info Edition availability
This guide installs the **Commercial Edition** (current release %%COMMERCIAL_VERSION%%) with the Prime CLI. It includes the Free plan. A license key unlocks Pro, Business, or Enterprise Grid later. For isolated networks, use [Airgapped on Docker](/self-hosting/methods/airgapped-edition). For the open-source Community Edition, see [Community Edition → Docker Compose](/self-hosting/community/docker-compose).
:::

Docker Compose is the recommended way to run Plane on a single machine. One command downloads the Prime CLI, which generates the configuration, pulls the images, and starts the full stack behind a bundled Caddy proxy that also handles HTTPS. Allow about 15 minutes. If you want to know what runs inside the stack, see [Plane architecture](/self-hosting/plane-architecture).

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). For Docker Compose you need:

- A Linux machine (or macOS for evaluation) with **2 vCPU and 4 GB RAM** minimum, 8 GB recommended, and disk for data if the database and uploads stay local.
- **Root or sudo access.** The installer places `prime-cli` under `/bin` and Plane under `/opt/plane`.
- **Ports 80 and 443** free on the machine and open in your firewall or security group.
- **Docker Engine 24+ with the Compose v2 plugin.** Check with `docker compose version`. If Docker isn't installed, run `curl -fsSL https://get.docker.com | sh` (Linux) or install Docker Desktop (macOS).
- A **domain name whose DNS record already resolves to this machine**, for example `plane.<your-company>.com`. You can also install on an IP address for a quick trial, but built-in HTTPS only works with a domain.
- Outbound access to `prime.plane.so`, Docker Hub, and Let's Encrypt.

::: warning Production deployments
For production, use managed PostgreSQL and S3-compatible storage rather than the bundled containers, so that a failure of this machine doesn't take your data with it. Choose **Advanced** during setup, or configure it later with `sudo prime-cli configure`. See [External services](/self-hosting/govern/database-and-storage).
:::

## Install

1. SSH into the machine as root, or as a user with sudo access.

2. Run the installer:

   ```bash
   curl -fsSL https://prime.plane.so/install/ | sh -
   ```

   The script downloads the Prime CLI for your OS and CPU architecture and runs `sudo prime-cli setup`. Optional flags skip the prompts:

   ```bash
   # Non-interactive install
   curl -fsSL https://prime.plane.so/install/ | sh -s -- --domain <your-domain> --silent

   # Another proxy or load balancer terminates TLS in front of Plane
   curl -fsSL https://prime.plane.so/install/ | sh -s -- --domain <your-domain> --behind-proxy
   ```

3. Follow the prompts. Press `Enter` to accept a default.
   - **Domain:** enter your domain, for example `plane.<your-company>.com`. Use an IP address for a quick trial. This becomes the URL your users open and the address the proxy requests a certificate for.
   - **Express** or **Advanced:** Express installs with defaults (bundled PostgreSQL, Redis, RabbitMQ, and MinIO; ports 80/443; 5 MB upload limit). Advanced also asks for the listening port, maximum upload size, an external PostgreSQL URL, an external Redis URL, and S3 credentials (access key, secret key, bucket). You can change all of these later with `sudo prime-cli configure`.

4. Wait for the images to pull and the services to start. The installer waits for database migrations and then prints **Plane has successfully installed**. Plane lives under `/opt/plane` from now on, with all configuration in `/opt/plane/plane.env`.

## Verify

1. Check that every service is healthy:

   ```bash
   sudo prime-cli healthcheck
   ```

   `sudo prime-cli monitor` opens a dashboard that lists each container's status and lets you tail its logs.

2. Open `https://<your-domain>` (or `http://<ip>`) in a browser. You should see the sign-in screen. You can't sign in yet, because the instance has no administrator. That is the next step.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**. The first item is required: open `https://<your-domain>/god-mode/` to create the instance admin. Until you do, nobody can sign in. The remaining steps set up email, authentication, backups, and production hardening.

::: tip Purchased a plan? Activate your license
Copy the license key from the [Prime portal](https://prime.plane.so/licenses). Sign in with the email you used to purchase.

- **Pro or Business:** in the app, go to **Workspace settings → Billing and plans → Activate this workspace**, paste the key, and click **Activate**. Each key activates one workspace. [Steps](/self-hosting/manage/manage-licenses/activate-pro-and-business#activate-your-license).
- **Enterprise Grid:** open **God Mode → Billing**, paste the key, and click **Activate**. It covers every workspace on the instance. [Steps](/self-hosting/manage/manage-licenses/activate-enterprise).

The instance needs outbound access to `prime.plane.so` to validate the license. Without a license, Plane runs on the Free plan. See [plans and pricing](https://plane.so/pricing).
:::

## Manage the instance

Use the Prime CLI ([full reference](/self-hosting/manage/prime-cli)):

```bash
sudo prime-cli start          # start all services
sudo prime-cli stop           # stop all services
sudo prime-cli restart        # restart, for example after editing /opt/plane/plane.env
sudo prime-cli monitor        # service status and live logs
sudo prime-cli configure      # change domain, ports, upload size, external DB/Redis/S3
sudo prime-cli backup         # back up data (see Backup and restore)
sudo prime-cli update-cli     # update the CLI itself; run this before upgrading Plane
sudo prime-cli upgrade        # upgrade Plane to the latest release
```

Related guides: [Update Plane](/self-hosting/manage/upgrade-plane), [Backup and restore](/self-hosting/manage/backup-restore), [View logs](/self-hosting/manage/view-logs), [Custom domain](/self-hosting/govern/custom-domain), [SSL](/self-hosting/govern/configure-ssl), [External reverse proxy](/self-hosting/govern/reverse-proxy).

## Troubleshoot

- **The installer can't download the Prime CLI.** The machine can't reach `prime.plane.so`. Check outbound access or your proxy settings, then run the `curl` command again. See [CLI errors](/self-hosting/troubleshoot/cli-errors).
- **`Error during docker compose execution`.** You are not root or don't have sudo, or the old `docker-compose` v1 binary is installed. See [Installation errors](/self-hosting/troubleshoot/installation-errors#error-during-docker-compose-execution).
- **The migrator container exited.** Usually an external database URL that points at `localhost`. Inside a container, `localhost` is the container itself. See [Migrator container exited](/self-hosting/troubleshoot/installation-errors#migrator-container-exited).
- **The site loads over HTTP only, or the certificate is invalid.** The DNS record didn't resolve to this machine when the proxy requested the certificate, or ports 80/443 aren't reachable from the internet. Fix DNS or the firewall, then run `sudo prime-cli restart`. See [SSL](/self-hosting/govern/configure-ssl).
- **Upgrading from the Community Edition?** Don't run this installer on top of an existing Community instance. Follow [Upgrade Community to Commercial](/self-hosting/upgrade-from-community), which migrates your data.
