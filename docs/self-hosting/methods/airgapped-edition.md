---
title: Deploy Plane with Airgapped Docker
description: Deploy Plane in airgapped environment without internet access. Complete guide for offline Plane installation.
keywords: plane airgapped, offline deployment, air-gapped docker, plane offline install, disconnected environment, self-hosting
---

# Deploy Plane Airgapped on Docker <Badge type="warning" text="Enterprise Grid" />

:::info
Airgapped deployments are available exclusively for Enterprise Grid customers with a minimum commitment of 100 seats. Contact our [Sales team](mailto:sales@plane.so) for trials, exceptions to the seat cut-off, tailored pricing, and licensing info.
:::

This guide walks you through deploying Plane Commercial in an airgapped Docker environment using Docker Compose and pre-configured images from your private registry.

## Prerequisites

Before starting, ensure you have:

- Docker (version 24 or later) installed and running
- Docker Compose Plugin installed (you should be able to run `docker compose` or `docker-compose`)
- Access to a private Docker registry containing Plane images
- Required ports opened to access the application (80, 443)

:::warning
While Docker can run stateful services with persistent volumes, we strongly recommend using external managed services for better reliability in backup/restore operations and disaster recovery.

Consider these alternatives:

- **MinIO**: Replace with AWS S3, Google Cloud Storage, or any S3-compatible service
- **Redis**: Replace with Valkey or a managed Redis service
- **PostgreSQL**: Use a managed PostgreSQL service
- **RabbitMQ**: Use a managed message queue service
- **OpenSearch**: Use a managed OpenSearch service
  :::

## Install Plane

1. **Prepare Docker images for airgapped environment**

   Refer to [this document](/self-hosting/methods/clone-docker-images) to download the Docker images from the Plane artifact registry to your internal registry.

   :::info
   This process will NOT download or clone these infrastructure images:
   - `valkey/valkey:7.2.11-alpine`
   - `postgres:15.7-alpine`
   - `rabbitmq:3.13.6-management-alpine`
   - `minio/minio:latest`
   - `minio/mc:latest`
   - `opensearchproject/opensearch:3.3.2`

   If you're using local infrastructure services, you'll need to pull and transfer these images separately.
   :::

2. **Download Docker Compose configuration**

   ```bash
   # Download docker-compose.yml
   curl -fsSL https://prime.plane.so/releases/<plane-version>/docker-compose-airgapped.yml -o docker-compose.yml

   # Download environment template
   curl -fsSL https://prime.plane.so/releases/<plane-version>/variables-airgapped.env -o plane.env
   ```

3. **Configure environment variables**

   Edit the `plane.env` file to configure your deployment:

   ```bash
   # Set your domain
   DOMAIN_NAME=plane.yourcompany.com
   WEB_URL=https://plane.yourcompany.com
   CORS_ALLOWED_ORIGINS=https://plane.yourcompany.com
   SITE_ADDRESS=https://plane.yourcompany.com

   # Paste the generated UUID here (see note below)
   MACHINE_SIGNATURE=your-uuid-here
   ```

   :::info
   **Generating `MACHINE_SIGNATURE`:** Run the following command in your terminal to generate a unique UUID, then paste the output as the value of `MACHINE_SIGNATURE` in `plane.env`:

   ```bash
   uuidgen
   ```

   :::

   **Update image references** in `docker-compose.yml` to point to your private registry:

   ```yaml
   services:
     web:
       image: your-registry.io/plane/web-commercial:${APP_RELEASE_VERSION}

     api:
       image: your-registry.io/plane/backend-commercial:${APP_RELEASE_VERSION}

     worker:
       image: your-registry.io/plane/backend-commercial:${APP_RELEASE_VERSION}

     beat-worker:
       image: your-registry.io/plane/backend-commercial:${APP_RELEASE_VERSION}

     migrator:
       image: your-registry.io/plane/backend-commercial:${APP_RELEASE_VERSION}

     importer-worker:
       image: your-registry.io/plane/backend-commercial:${APP_RELEASE_VERSION}

     automation-consumer:
       image: your-registry.io/plane/backend-commercial:${APP_RELEASE_VERSION}

     webhook-consumer:
       image: your-registry.io/plane/backend-commercial:${APP_RELEASE_VERSION}

     outbox-poller:
       image: your-registry.io/plane/backend-commercial:${APP_RELEASE_VERSION}

     space:
       image: your-registry.io/plane/space-commercial:${APP_RELEASE_VERSION}

     admin:
       image: your-registry.io/plane/admin-commercial:${APP_RELEASE_VERSION}

     live:
       image: your-registry.io/plane/live-commercial:${APP_RELEASE_VERSION}

     live-exporter:
       image: your-registry.io/plane/live-commercial:${APP_RELEASE_VERSION}

     monitor:
       image: your-registry.io/plane/monitor-commercial:${APP_RELEASE_VERSION}

     silo:
       image: your-registry.io/plane/silo-commercial:${APP_RELEASE_VERSION}

     email:
       image: your-registry.io/plane/email-commercial:${APP_RELEASE_VERSION}

     pi-api:
       image: your-registry.io/plane/plane-pi-commercial:${APP_RELEASE_VERSION}

     pi-beat:
       image: your-registry.io/plane/plane-pi-commercial:${APP_RELEASE_VERSION}

     pi-worker:
       image: your-registry.io/plane/plane-pi-commercial:${APP_RELEASE_VERSION}

     pi-migrator:
       image: your-registry.io/plane/plane-pi-commercial:${APP_RELEASE_VERSION}

     runner:
       image: your-registry.io/plane/node-runner-commercial:${APP_RELEASE_VERSION}

     iframely:
       image: your-registry.io/plane/iframely:v2.5.3

     proxy:
       image: your-registry.io/plane/proxy-commercial:${APP_RELEASE_VERSION}
   ```

   **Infrastructure services** (if using local setup):

   ```yaml
   services:
     plane-redis:
       image: valkey/valkey:7.2.11-alpine

     plane-db:
       image: postgres:15.7-alpine

     pi-db-init:
       image: postgres:15.7-alpine

     plane-mq:
       image: rabbitmq:3.13.6-management-alpine

     plane-minio:
       image: minio/minio:latest
   ```

## Start Plane

1. Start the services:

   ```bash
   docker compose --env-file plane.env up -d
   ```

2. Watch the logs to make sure everything starts properly.
   - To monitor the database migration process:

   ```bash
   docker compose logs -f migrator
   ```

   - To monitor the API service startup:

   ```bash
   docker compose logs -f api
   ```

   The API is healthy when you see: `api-1   listening at`

   Once all services are running smoothly, you can access Plane by opening your browser and going to the domain you configured.

   You now have Plane running in your air-gapped environment. If you run into any issues, check the logs using the commands above, or reach out to our support team for assistance.

3. [Activate your license key](/self-hosting/manage/manage-licenses/activate-airgapped)

## Use your own SSL certificate

An airgapped host cannot reach Let's Encrypt, so Plane starts on plain HTTP. To serve HTTPS, use a certificate issued by your internal CA. Available in Plane v3.2.0 and later.

The `proxy` service mounts the `ssl/` folder of your install directory read-only at `/ssl`. The install directory is the directory that holds `docker-compose.yml` and `plane.env`.

1. **Place the certificate and key**

   ```bash
   cd /path/to/plane
   mkdir -p ssl
   cp fullchain.pem ssl/cert.pem     # PEM, full chain (leaf plus intermediates)
   cp privkey.pem   ssl/key.pem      # PEM private key matching cert.pem
   chmod 600 ssl/key.pem
   ```

   The certificate must cover the domain you set in `plane.env`, and be issued by a CA your users' browsers trust.

2. **Switch `plane.env` to HTTPS**

   ```bash
   SITE_ADDRESS=plane.yourcompany.com
   APP_PROTOCOL=https
   WEB_URL=https://plane.yourcompany.com
   CORS_ALLOWED_ORIGINS=https://plane.yourcompany.com
   ```

   If `SITE_ADDRESS` is left as a plain-HTTP address (`localhost:80`, `:80`, or an `http://` URL) the certificate is ignored with a warning.

3. **Recreate the proxy**

   ```bash
   docker compose --env-file plane.env up -d --force-recreate proxy
   ```

   If you also changed `WEB_URL` or `CORS_ALLOWED_ORIGINS`, recreate the services that read them:

   ```bash
   docker compose --env-file plane.env up -d --force-recreate api web space admin live
   ```

4. **Verify**

   ```bash
   docker compose --env-file plane.env logs proxy | grep -i "ssl certificate"
   ```

   Expect `Custom SSL certificate enabled: /ssl/cert.pem (key: /ssl/key.pem)`. If you see `WARNING: custom SSL certificate ignored:` instead, the reason follows on the same line. Then open `https://plane.yourcompany.com` from a machine that trusts your CA.

To rotate the certificate, replace both files in `ssl/` and recreate the proxy. The `ssl/` folder is kept across upgrades. For file formats, permissions and the full troubleshooting table, see [Use your own certificate](/self-hosting/govern/configure-ssl#use-your-own-certificate).
