---
title: Portainer
description: Deploy Plane Commercial Edition as a Portainer stack. Download the stack file and environment template for a release, add the stack in Portainer, set the required variables, deploy, and verify.
keywords: plane portainer, portainer stack plane, portainer-compose.yml, docker management ui, self-hosting
---

# Portainer <EditionBadge edition="commercial" />

::: info Edition availability
Commercial Edition only. Portainer deploys the same stack the [Docker Compose](/self-hosting/methods/docker-compose) installer would, managed from the Portainer UI instead of the Prime CLI.
:::

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). You also need a Portainer environment attached to a Docker host (or Swarm) on Docker Engine 24+, ports 80/443 free on that host, DNS pointing at it, and outbound access to Docker Hub and `prime.plane.so`.

## Install

1. Download the stack file and the environment template for the release (current: %%COMMERCIAL_VERSION%%):

   ```bash
   curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/portainer-compose.yml -o portainer-compose.yml
   curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/variables.env -o plane.env
   ```

2. Edit `plane.env`. Required:

   ```bash
   APP_RELEASE_VERSION=%%COMMERCIAL_VERSION%%
   DOMAIN_NAME=<your-domain>
   SITE_ADDRESS=<your-domain>          # or :80 behind your own TLS-terminating proxy
   WEB_URL=https://<your-domain>
   CORS_ALLOWED_ORIGINS=https://<your-domain>
   CERT_EMAIL=<your-email>
   MACHINE_SIGNATURE=<openssl rand -hex 16> # required; the license monitor won't start without it
   ```

   Rotate the shipped secrets (`SECRET_KEY`, `LIVE_SERVER_SECRET_KEY`, `SILO_HMAC_SECRET_KEY`, `AES_SECRET_KEY`, database, RabbitMQ, and MinIO passwords). For production, set `DATABASE_URL`, `REDIS_URL`, `AMQP_URL`, and `AWS_*` to managed services. See [External services](/self-hosting/govern/database-and-storage) and [Environment variables](/self-hosting/govern/environment-variables).

3. In Portainer, open your environment, go to **Stacks**, click **+ Add stack**, name it `plane`, and paste the contents of `portainer-compose.yml` into the web editor.

4. Under **Environment variables**, choose **Load variables from .env file** and upload `plane.env` (or add the variables one by one).

5. Click **Deploy the stack** and wait for every service to reach _running_. The migrator exits after it completes.

## Verify

In Portainer, open the stack and check the container states. Then open `https://<your-domain>`. You should see the sign-in page. Create the instance admin next.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**, starting with `https://<your-domain>/god-mode/`.

::: tip Purchased a plan? Activate your license
Copy the license key from the [Prime portal](https://prime.plane.so/licenses). Sign in with the email you used to purchase.

- **Pro or Business:** in the app, go to **Workspace settings → Billing and plans → Activate this workspace**, paste the key, and click **Activate**. Each key activates one workspace. [Steps](/self-hosting/manage/manage-licenses/activate-pro-and-business#activate-your-license).
- **Enterprise Grid:** open **God Mode → Billing**, paste the key, and click **Activate**. It covers every workspace on the instance. [Steps](/self-hosting/manage/manage-licenses/activate-enterprise).

The instance needs outbound access to `prime.plane.so` to validate the license. Without a license, Plane runs on the Free plan. See [plans and pricing](https://plane.so/pricing).
:::

## Manage the stack

Use the stack's **Editor** to change variables and **Update the stack** to apply. To upgrade, download the new `portainer-compose.yml` and `variables.env` for the release, merge new variables into your `plane.env`, set `APP_RELEASE_VERSION`, replace the stack definition, and update with **Re-pull image**. Back up first. See [Backup and restore](/self-hosting/manage/backup-restore#other-deployment-methods). This stack file has no built-in intake email service. Use [Docker Compose](/self-hosting/methods/docker-compose) if you need [intake email](/self-hosting/govern/configure-dns-email-service).

## Troubleshoot

- **`monitor` restarts.** `MACHINE_SIGNATURE` is empty.
- **The proxy can't get a certificate.** DNS or ports 80/443. Use `SITE_ADDRESS=:80` behind your own proxy.
- More: [Troubleshoot](/self-hosting/troubleshoot/overview).
