---
title: Docker Swarm
description: Deploy Plane Commercial Edition on a Docker Swarm cluster with docker stack deploy. Download the stack file and environment template for a release, configure, deploy, verify, and manage.
keywords: plane docker swarm, docker stack deploy plane, swarm-compose.yml, plane swarm cluster, self-hosting
---

# Docker Swarm <EditionBadge edition="commercial" />

::: info Edition availability
Commercial Edition only. If you don't already run Swarm, use [Docker Compose](/self-hosting/methods/docker-compose) on a single machine or [Kubernetes](/self-hosting/methods/kubernetes) for a cluster. Both are managed for you (Prime CLI, Helm). A Swarm stack is managed by hand.
:::

Plane publishes a Swarm-ready stack file for each release. You download it with the environment template, fill in a few values, and deploy with `docker stack deploy`. The data services (PostgreSQL, Redis, RabbitMQ, MinIO) are included as single-replica services with named volumes. For production, point Plane at managed services instead.

## Before you begin

Read [Before you install](/self-hosting/methods/prerequisites). For Swarm you need:

- An initialized Swarm (`docker swarm init`, plus joined nodes) on Docker Engine 24+, AMD64 or ARM64.
- Ports 80 and 443 free and reachable on the nodes that publish the proxy.
- A domain whose DNS points at the cluster or at a load balancer in front of it.
- Outbound access to Docker Hub and `prime.plane.so` from every node.
- Recommended: managed PostgreSQL and S3-compatible storage. The stateful services in the stack use named volumes on one node and are not highly available.

## Install

1. Download the stack file and environment template for the release (current: %%COMMERCIAL_VERSION%%):

   ```bash
   curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/swarm-compose.yml -o swarm-compose.yml
   curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/variables.env -o plane.env
   ```

   For other releases, replace the version in both URLs. See [Download config files](/self-hosting/methods/download-config).

2. Edit `plane.env`. Required:

   ```bash
   APP_RELEASE_VERSION=%%COMMERCIAL_VERSION%%
   DOMAIN_NAME=plane.company.com
   SITE_ADDRESS=plane.company.com          # or :80 behind your own TLS-terminating proxy
   WEB_URL=https://plane.company.com
   CORS_ALLOWED_ORIGINS=https://plane.company.com
   CERT_EMAIL=admin@company.com            # for the automatic Let's Encrypt certificate
   MACHINE_SIGNATURE=<openssl rand -hex 16> # required; the license monitor won't start without it
   ```

   Rotate the shipped secrets before real use (`SECRET_KEY`, `LIVE_SERVER_SECRET_KEY`, `SILO_HMAC_SECRET_KEY`, `AES_SECRET_KEY`, and the PostgreSQL, RabbitMQ, and MinIO passwords). For production, set `DATABASE_URL`, `REDIS_URL`, `AMQP_URL`, and the `AWS_*` variables to your managed services. See [External services](/self-hosting/govern/database-and-storage) and [Environment variables](/self-hosting/govern/environment-variables).

   ::: tip
   Generate the machine signature in place: `sed -i "s/^MACHINE_SIGNATURE=.*/MACHINE_SIGNATURE=$(openssl rand -hex 16)/" plane.env` (on macOS use `sed -i ''`).
   :::

3. Export the variables and deploy the stack:

   ```bash
   set -o allexport; source ./plane.env; set +o allexport
   docker stack deploy -c swarm-compose.yml plane
   ```

## Verify

```bash
docker stack services plane          # every service 1/1; migrator finishes and shows 0/1, which is normal
docker service logs -f plane_api     # ends with "Application startup complete"
```

Open `https://plane.company.com`. You should see the sign-in page. Sign-in works after you create the instance admin.

## After you install

Follow **[After you install](/self-hosting/methods/after-install)**, starting with `https://plane.company.com/god-mode/`.

## Manage the stack

```bash
docker stack ps plane                                  # placement and state
docker service scale plane_api=2 plane_worker=2        # scale stateless services
docker stack rm plane                                  # remove; named volumes are kept
```

**Upgrade:** download the new `swarm-compose.yml` and `variables.env` for the release, merge any new variables into your `plane.env`, set `APP_RELEASE_VERSION`, re-export, and run `docker stack deploy` again. Swarm rolls the services. Back up first. See [Backup and restore](/self-hosting/manage/backup-restore#other-deployment-methods).

## Troubleshoot

- **`monitor` restarts.** `MACHINE_SIGNATURE` is empty.
- **The proxy can't get a certificate.** DNS doesn't resolve to the node publishing 80/443, or the ports aren't reachable. Use `SITE_ADDRESS=:80` behind your own proxy.
- **Variables didn't apply.** You skipped `set -o allexport; source ./plane.env`. The stack file reads them from your shell, not from the file.
- More: [Troubleshoot](/self-hosting/troubleshoot/overview).
