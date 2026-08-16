---
title: Coolify
description: Deploy Plane Commercial Edition on Coolify from the Plane Compose template. Create the resource, set the domain and release version, deploy, and verify.
keywords: plane coolify, coolify plane deployment, coolify-compose.yml, plane paas, self-hosting
---

# Coolify <EditionBadge edition="commercial" />

::: info Edition availability
Commercial Edition only. Coolify generates the secrets and passwords for you and terminates TLS at its own proxy. Plane's built-in proxy runs plain HTTP behind it.
:::

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). You also need a Coolify instance with a server on Docker Engine 24+ (AMD64 or ARM64), a domain pointed at that server, and outbound access to Docker Hub and `prime.plane.so`.

## Install

1. Download the Compose template for the release (current: %%COMMERCIAL_VERSION%%):

   ```bash
   curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/coolify-compose.yml -o coolify-compose.yml
   ```

2. In Coolify, open a project, click **+ New resource**, choose **Docker Compose Empty**, and paste the contents of `coolify-compose.yml`.

3. Set the domain on the **proxy** service (Coolify's `SERVICE_FQDN_PLANE_80`, for example `https://plane.company.com`). Coolify fills `APP_DOMAIN`, `MACHINE_SIGNATURE`, `SECRET_KEY`, `LIVE_SERVER_SECRET_KEY`, `SILO_HMAC_SECRET_KEY`, and the PostgreSQL, RabbitMQ, and MinIO credentials from its own generated values.

4. In the resource's **Environment variables**, set:

   ```bash
   APP_RELEASE_VERSION=%%COMMERCIAL_VERSION%%   # required; the template ships with a placeholder version
   ```

   For production, also set `DATABASE_URL`, `REDIS_URL`, `AMQP_URL`, and the `AWS_*` variables to managed services ([External services](/self-hosting/govern/database-and-storage)), and replace `AES_SECRET_KEY` and `PI_INTERNAL_SECRET`. The template still carries default values for those two.

5. Click **Deploy** and wait for all services to be healthy.

## Verify

Open the domain you set. You should see the sign-in page. Create the instance admin next.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**, starting with `https://plane.company.com/god-mode/`.

## Manage

Change environment variables in Coolify and redeploy. To upgrade, download the new `coolify-compose.yml`, replace the resource's Compose content, set `APP_RELEASE_VERSION` to the new release, and redeploy. Back up first. See [Backup and restore](/self-hosting/manage/backup-restore#other-deployment-methods). This template has no intake email service. Use [Docker Compose](/self-hosting/methods/docker-compose) if you need [intake email](/self-hosting/govern/configure-dns-email-service).

## Troubleshoot

- **Image pulls fail with a `v1.x.x` tag.** `APP_RELEASE_VERSION` isn't set.
- **`monitor` restarts.** `MACHINE_SIGNATURE` is empty. Check that Coolify generated it, or set it yourself with `openssl rand -hex 16`.
- More: [Troubleshoot](/self-hosting/troubleshoot/overview).
