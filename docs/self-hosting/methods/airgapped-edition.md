---
title: Airgapped on Docker
description: Install the Airgapped Edition with Docker Compose in a network without internet access. Mirror the images to your registry, download the airgapped Compose file and environment template, configure, start, verify, and activate the license file.
keywords: plane airgapped docker, offline plane install, air-gapped docker compose, plane private registry, docker-compose-airgapped.yml, self-hosting
---

# Airgapped on Docker <EditionBadge edition="airgapped" plan="enterprise" />

::: info Availability
The Airgapped Edition is available to Enterprise Grid customers (minimum 100 seats). Contact [sales](mailto:sales@plane.so) for trials and exceptions. Read the [Airgapped Edition overview](/self-hosting/methods/airgapped-requirements) first. It explains the bundle, registry, and license-file flow this guide assumes. Current release: %%COMMERCIAL_VERSION%%.
:::

This guide installs the full Commercial stack with Docker Compose on a single machine inside your perimeter, pulling every image from your private registry. Allow about an hour once the images are mirrored.

## Before you begin

From [Before you install](/self-hosting/methods/prerequisites) and the [airgapped overview](/self-hosting/methods/airgapped-requirements#docker-specific-requirements):

- A Linux machine with Docker Engine **24+** and the Compose v2 plugin, root or sudo access, 4 vCPU / 8 GB RAM recommended, ports **80 and 443** free.
- Your **private registry** populated with the Plane images for %%COMMERCIAL_VERSION%% ([Clone Docker images](/self-hosting/methods/clone-docker-images)) and, if you run them locally, the infrastructure images: `postgres:15.7-alpine`, `valkey/valkey:7.2.11-alpine`, `rabbitmq:3.13.6-management-alpine`, `minio/minio:latest` (pin a specific MinIO release when mirroring), and `opensearchproject/opensearch:3.3.2` if you use advanced search.
- Internal DNS for your Plane hostname, and an internal CA certificate if you want HTTPS (or terminate TLS at your own proxy).
- License files for %%COMMERCIAL_VERSION%% from the [Prime portal](https://prime.plane.so/licenses).

::: warning Production deployments
Use managed PostgreSQL and S3-compatible storage inside your perimeter rather than the bundled containers, so that a machine failure doesn't take your data with it. See [External services](/self-hosting/govern/database-and-storage).
:::

## Install

1. **On the connected machine**, download the airgapped Compose file and environment template for the release, and move them across the boundary with the images:

   ```bash
   curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/docker-compose-airgapped.yml -o docker-compose.yml
   curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/variables-airgapped.env -o plane.env
   ```

   For other releases, see [Download config files](/self-hosting/methods/download-config).

2. **On the airgapped machine**, point every image at your registry. The Compose file references `makeplane/<image>:%%COMMERCIAL_VERSION%%` and the public infrastructure images. One `sed` per pattern rewrites them:

   ```bash
   REGISTRY=registry.internal.company.com        # your registry host (and path prefix, if any)

   # Plane images: makeplane/web-commercial:<tag> becomes registry.internal.company.com/makeplane/web-commercial:<tag>
   sed -i "s#image: makeplane/#image: ${REGISTRY}/makeplane/#g" docker-compose.yml

   # Infrastructure images, if you mirrored them (skip the ones you replace with managed services)
   sed -i -E "s#image: (postgres|valkey/valkey|rabbitmq|minio/minio|minio/mc|opensearchproject/opensearch):#image: ${REGISTRY}/\1:#g" docker-compose.yml

   grep 'image:' docker-compose.yml     # every line should now start with your registry
   ```

   On macOS use `sed -i ''`. Mirror the images under the same paths (`<registry>/makeplane/backend-commercial`, `<registry>/postgres`, and so on) so that the rewrite is a plain prefix. That is what the [clone guide](/self-hosting/methods/clone-docker-images) does.

3. **Configure `plane.env`.** The template already sets `IS_AIRGAPPED=1` and `APP_RELEASE_VERSION=%%COMMERCIAL_VERSION%%`. Edit these values in the file (don't `export` them; Compose reads the file):

   ```bash
   DOMAIN_NAME=plane.internal.company.com
   SITE_ADDRESS=:80                          # plain HTTP; TLS is terminated by your own proxy, or set your hostname with your own certs
   WEB_URL=https://plane.internal.company.com
   CORS_ALLOWED_ORIGINS=https://plane.internal.company.com
   MACHINE_SIGNATURE=<output of uuidgen>     # required
   ```

   Then rotate the shipped secrets (`SECRET_KEY`, `LIVE_SERVER_SECRET_KEY`, `SILO_HMAC_SECRET_KEY`, `AES_SECRET_KEY`, `PI_INTERNAL_SECRET`, service passwords), and set `DATABASE_URL`, `REDIS_URL`, `AMQP_URL`, `USE_MINIO=0`, and `AWS_*` for your managed services. If your S3 endpoint uses an internally signed certificate, the API must trust your CA. `SSL_VERIFY=0` disables verification for outgoing connections and is acceptable only for a trial. See [Environment variables](/self-hosting/govern/environment-variables). Don't set `SITE_ADDRESS` to a bare domain here. The built-in proxy would try to reach Let's Encrypt.

4. **Start Plane** and watch the migration and the API come up:

   ```bash
   docker compose --env-file plane.env up -d
   docker compose logs -f migrator      # exits when migrations are applied
   docker compose logs -f api           # ready when you see "listening at" or "Application startup complete"
   ```

## Verify

```bash
docker compose --env-file plane.env ps
```

All services `running` (`migrator` exits). Open `https://plane.internal.company.com`. You should see the sign-in page. Sign-in works after you create the instance admin.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**: create the instance admin at `/god-mode/`, configure your internal SMTP relay, set up sign-in, then activate the license from the file. **Enterprise Grid:** God Mode → Billing → upload ([guide](/self-hosting/manage/manage-licenses/activate-airgapped-enterprise)). **Per workspace:** Workspace settings → Billing and plans → Activate this workspace → upload ([guide](/self-hosting/manage/manage-licenses/activate-airgapped)). Nothing in the deployment contacts `prime.plane.so`.

## Manage

```bash
docker compose --env-file plane.env ps               # status
docker compose --env-file plane.env logs -f <service>
docker compose --env-file plane.env restart          # after editing plane.env
docker compose --env-file plane.env down             # stop; data is kept
```

Upgrades are a new release's images and files. See [Update Airgapped on Docker](/self-hosting/manage/update-plane/airgapped-edition/update-airgapped-docker). Back up with your database and storage tooling. See [Backup and restore](/self-hosting/manage/backup-restore#other-deployment-methods).

## Troubleshoot

- **`pull access denied` or `manifest unknown`.** An image wasn't mirrored under the expected path or tag. Compare `grep image: docker-compose.yml` with your registry.
- **`monitor` restarts.** `MACHINE_SIGNATURE` is empty, or `IS_AIRGAPPED` is not `1` (the monitor would try to reach Prime).
- **The proxy restarts.** `SITE_ADDRESS` is set to a hostname, so Caddy tries to obtain a certificate from Let's Encrypt. Use `:80` and terminate TLS in front, or provide your own certificate.
- **The API can't reach S3, or reports TLS errors.** The internal CA isn't trusted by the containers.
- More: [Troubleshoot](/self-hosting/troubleshoot/overview).
