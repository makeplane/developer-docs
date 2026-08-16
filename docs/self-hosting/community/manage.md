---
title: Manage your Community Edition instance
description: Operate a Plane Community Edition instance installed with setup.sh. Start and stop, environment variables, external services, changing the domain, upgrades, logs, backup and restore.
keywords: plane community edition manage, setup.sh, plane.env, plane environment variables community, plane upgrade community, plane backup restore community, plane logs
---

# Manage your instance <EditionBadge edition="community" />

This page applies to a Community Edition instance installed with `setup.sh` on Docker Compose ([install guide](/self-hosting/community/docker-compose)). Kubernetes installs are managed with Helm. See [Kubernetes (Community Edition)](/self-hosting/community/kubernetes). Commercial Edition instances use the [Prime CLI](/self-hosting/manage/prime-cli).

## The setup.sh script

Run `./setup.sh` from the folder where you downloaded it (the one that contains `plane-app/`) to open the menu, or pass the action as an argument:

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
```

| Menu | Command              | What it does                                                                                                                                                                                              |
| ---- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `./setup.sh install` | Downloads the latest release's `docker-compose.yaml` and `plane.env` into `plane-app/`. Existing `plane.env` values are preserved and merged. The previous files are archived under `plane-app/archive/`. |
| 2    | `./setup.sh start`   | Runs `docker compose up -d`, then waits for the migrator and the API. This is the default action if you press Enter.                                                                                      |
| 3    | `./setup.sh stop`    | Runs `docker compose down`. Named volumes (database, uploads, queue, cache) are kept.                                                                                                                     |
| 4    | `./setup.sh restart` | Stop, then start. Use it after editing `plane-app/plane.env`.                                                                                                                                             |
| 5    | `./setup.sh upgrade` | Checks GitHub for a newer release, stops the stack, and downloads the new files. **It does not start the stack again.** Run `start` afterwards.                                                           |
| 6    | `./setup.sh logs`    | Pick a service and tail its logs. `Ctrl+C` returns to the menu.                                                                                                                                           |
| 7    | `./setup.sh backup`  | Copies the data of PostgreSQL, MinIO, RabbitMQ, and Redis into `plane-app/backup/<timestamp>/*.tar.gz`. Services must be running.                                                                         |
| 8    |                      | Exit. After actions 1 to 5 and 7 the script exits on its own. Only _View Logs_ returns to the menu.                                                                                                       |

Files: `plane-app/docker-compose.yaml` (don't edit; it is replaced on upgrade), `plane-app/plane.env` (your configuration), `plane-app/backup/`, `plane-app/archive/`. The Compose project is named `plane-app`, so containers are `plane-app-api-1`, volumes are `plane-app_pgdata`, and so on. You can always run Compose directly:

```bash
docker compose -f plane-app/docker-compose.yaml --env-file plane-app/plane.env ps
```

## Environment variables

Configuration lives in `plane-app/plane.env`. Edit it, then run `./setup.sh restart`.

::: warning Two things that trip people up

1. `WEB_URL` and `CORS_ALLOWED_ORIGINS` default to `http://${APP_DOMAIN}`. Setting `APP_DOMAIN` is enough for plain HTTP. When you serve Plane over HTTPS (your domain in `SITE_ADDRESS`, or a reverse proxy), change both to `https://...` as well, or logins and links break.
2. Email (SMTP), OAuth providers, and similar instance settings are configured in **God Mode**, not in `plane.env`. Values in the environment are only used to seed God Mode on the very first start.
   :::

### Application

| Variable                                           | Default                | Description                                                                                                                        |
| -------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **APP_DOMAIN**                                     | `localhost`            | Hostname (or IP) of the instance. Passed to the proxy and the API.                                                                 |
| **APP_RELEASE**                                    | `stable`               | Image tag. `setup.sh` sets this to the release it installed (currently %%CE_VERSION%%). Leave it alone.                            |
| **WEB_URL**                                        | `http://${APP_DOMAIN}` | Full public URL with protocol, used for links in emails and redirects. Change the scheme to `https://` when you enable TLS.        |
| **CORS_ALLOWED_ORIGINS**                           | `http://${APP_DOMAIN}` | Comma-separated origins allowed to call the API. Normally the same as `WEB_URL`.                                                   |
| **DEBUG**                                          | `0`                    | Verbose logging. Never enable it in production.                                                                                    |
| **SECRET_KEY**                                     | placeholder            | Django secret for sessions and tokens. Generate it with `openssl rand -hex 32`. The placeholder boots but logs a security warning. |
| **LIVE_SERVER_SECRET_KEY**                         | placeholder            | Shared secret between the API and the real-time server. Generate your own.                                                         |
| **API_KEY_RATE_LIMIT**                             | `60/minute`            | Throttle for API-key requests.                                                                                                     |
| **FILE_SIZE_LIMIT**                                | `5242880`              | Maximum upload size in bytes (5 MB), enforced by the proxy and the API.                                                            |
| **WEBHOOK_ALLOWED_IPS**, **WEBHOOK_ALLOWED_HOSTS** | empty                  | Comma-separated private IPs/CIDRs or hostnames that webhooks may target despite the private-network safety check.                  |

### Proxy, ports, and TLS

| Variable               | Default                            | Description                                                                                                                                                                                                                                                                                                    |
| ---------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LISTEN_HTTP_PORT**   | `80`                               | Host port published for HTTP.                                                                                                                                                                                                                                                                                  |
| **LISTEN_HTTPS_PORT**  | `443`                              | Host port published for HTTPS.                                                                                                                                                                                                                                                                                 |
| **SITE_ADDRESS**       | `:80`                              | Address the bundled Caddy proxy serves. `<your-domain>`: serve that hostname and obtain a Let's Encrypt certificate automatically (needs ports 80/443 reachable and DNS pointing here). `:80`: plain HTTP for any hostname, for trials or behind your own [reverse proxy](/self-hosting/govern/reverse-proxy). |
| **CERT_EMAIL**         | empty                              | Email for Let's Encrypt registration when `SITE_ADDRESS` is a domain.                                                                                                                                                                                                                                          |
| **CERT_ACME_CA**       | Let's Encrypt production directory | ACME directory URL. Switch to the staging URL while testing to avoid rate limits.                                                                                                                                                                                                                              |
| **CERT_ACME_DNS**      | empty                              | `<provider> <api-token>` for DNS-01 validation when port 80 can't be reached from the internet.                                                                                                                                                                                                                |
| **MINIO_ENDPOINT_SSL** | `0`                                | Set to `1` when Plane is served over HTTPS so that links to uploaded files use `https`.                                                                                                                                                                                                                        |

### Data services

The bundled containers read these on first start. The application connects using the `*_URL` values.

| Variable                                                                                                                                     | Default                                           | Description                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **POSTGRES_USER**, **POSTGRES_PASSWORD**, **POSTGRES_DB**                                                                                    | `plane` / `plane` / `plane`                       | Credentials for the bundled PostgreSQL (`plane-db`). Change the password before real use.                                                      |
| **DATABASE_URL**                                                                                                                             | empty → `postgresql://plane:plane@plane-db/plane` | Connection string the application uses. **Set this to use an external PostgreSQL**, and keep it in sync if you change the bundled credentials. |
| **REDIS_URL**                                                                                                                                | empty → `redis://plane-redis:6379/`               | Redis/Valkey connection string. Set it for an external Redis.                                                                                  |
| **RABBITMQ_USER**, **RABBITMQ_PASSWORD**, **RABBITMQ_VHOST**                                                                                 | `plane` / `plane` / `plane`                       | Credentials for the bundled RabbitMQ (`plane-mq`).                                                                                             |
| **AMQP_URL**                                                                                                                                 | empty → `amqp://plane:plane@plane-mq:5672/plane`  | Connection string the application uses. Set it for an external RabbitMQ.                                                                       |
| **USE_MINIO**                                                                                                                                | `1`                                               | `1`: bundled MinIO, with file URLs served through the proxy. `0`: external S3-compatible storage.                                              |
| **AWS_ACCESS_KEY_ID**, **AWS_SECRET_ACCESS_KEY**                                                                                             | `access-key` / `secret-key`                       | Storage credentials. With MinIO they are also its root user and password. Change them.                                                         |
| **AWS_S3_ENDPOINT_URL**                                                                                                                      | `http://plane-minio:9000`                         | S3 endpoint. Set it to your provider's endpoint for external storage.                                                                          |
| **AWS_S3_BUCKET_NAME**                                                                                                                       | `uploads`                                         | Bucket name. Also used by the proxy to route file URLs.                                                                                        |
| **AWS_REGION**                                                                                                                               | empty                                             | Region for external S3.                                                                                                                        |
| **WEB_REPLICAS**, **SPACE_REPLICAS**, **ADMIN_REPLICAS**, **API_REPLICAS**, **WORKER_REPLICAS**, **BEAT_WORKER_REPLICAS**, **LIVE_REPLICAS** | `1`                                               | Replica counts per service. Mainly useful with Docker Swarm.                                                                                   |

`PGHOST`, `PGDATABASE`, `POSTGRES_PORT`, `PGDATA`, `REDIS_HOST`, `REDIS_PORT`, `RABBITMQ_HOST`, `RABBITMQ_PORT`, `GUNICORN_WORKERS`, `AUTHENTICATION_RATE_LIMIT`, and `TRUSTED_PROXIES` also appear in the file. They are either fixed by the Compose file or not passed to the containers in the current release. Changing them has no effect.

## Use external services {#use-external-services}

For production, run PostgreSQL and object storage outside the machine so that a host failure doesn't take your data with it. In `plane-app/plane.env`:

```bash
# External PostgreSQL 15.7+/16. The application only reads DATABASE_URL.
DATABASE_URL=postgresql://plane:<password>@<db-host>:5432/plane

# External Redis / Valkey 7.2+
REDIS_URL=redis://<redis-host>:6379/

# External RabbitMQ 3.13+
AMQP_URL=amqp://plane:<password>@<rabbitmq-host>:5672/plane

# S3-compatible object storage
USE_MINIO=0
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<access key>
AWS_SECRET_ACCESS_KEY=<secret key>
AWS_S3_ENDPOINT_URL=https://s3.us-east-1.amazonaws.com
AWS_S3_BUCKET_NAME=plane-uploads
```

Then run `./setup.sh restart`. Notes:

- Don't use `localhost` in these URLs. Inside a container, `localhost` is the container itself. Use a hostname or IP reachable from the Docker network.
- The bucket needs a CORS policy that allows your `WEB_URL` origin. See [External services](/self-hosting/govern/database-and-storage) for the policy and provider notes.
- To move existing data (uploads, database) rather than start fresh, see [Migrate to external services](/self-hosting/manage/migration/migrate-data-to-external-services). The bundled containers keep running but stay idle. You can remove them from the Compose file if you prefer.

## Change the domain {#change-the-domain}

1. Point the new DNS record at the machine.
2. In `plane-app/plane.env`, update `APP_DOMAIN`, `WEB_URL`, `CORS_ALLOWED_ORIGINS`, and `SITE_ADDRESS` (and `CERT_EMAIL` if you are switching HTTPS on).
3. Run `./setup.sh restart`.

Behind your own reverse proxy or load balancer, keep `SITE_ADDRESS=:80` and follow [External reverse proxy](/self-hosting/govern/reverse-proxy).

## Upgrade

Releases are announced on [GitHub](https://github.com/makeplane/plane/releases) and the [changelog](https://plane.so/changelog). The current release is %%CE_VERSION%%.

::: warning
Take a [backup](#back-up-and-restore) first. If you are still on a release before v0.14.0, follow the [0.13.2 to 0.14.0 migration](/self-hosting/manage/upgrade-from-0.13.2-0.14.0) before continuing.
:::

1. Refresh the installer itself, then run the upgrade:

   ```bash
   curl -fsSL -o setup.sh https://github.com/makeplane/plane/releases/latest/download/setup.sh
   chmod +x setup.sh
   ./setup.sh upgrade
   ```

   The script shows the current and latest release, asks for confirmation, stops the stack, and downloads the new `docker-compose.yaml` and environment template. Your `plane.env` is kept: existing values are carried forward, new variables get their defaults, and the previous files are archived under `plane-app/archive/`.

2. Open `plane-app/plane.env` and review any new variables. The script prints a reminder.

3. Start the stack. Upgrade does not do this for you:

   ```bash
   ./setup.sh start
   ```

   The migrator applies database migrations before the API comes up. Check `./setup.sh logs` → Migrator if the start step reports a failure.

## View logs

```bash
./setup.sh logs
```

```
Select a Service you want to view the logs for:
   1) Web
   2) Space
   3) API
   4) Worker
   5) Beat-Worker
   6) Migrator
   7) Proxy
   8) Redis
   9) Postgres
   10) Minio
   11) RabbitMQ
   0) Back to Main Menu
```

The `admin` and `live` services aren't in the menu. Tail them with Compose directly:

```bash
docker compose -f plane-app/docker-compose.yaml --env-file plane-app/plane.env logs -f live
```

A healthy API log ends with `Application startup complete`. A healthy migrator log ends with `No migrations Pending` or a list of applied migrations.

## Back up and restore

**Back up.** With the stack running:

```bash
./setup.sh backup
```

This copies the PostgreSQL data directory, MinIO uploads, RabbitMQ data, and Redis data into `plane-app/backup/<YYYYMMDD-HHMM>/` as `pgdata.tar.gz`, `uploads.tar.gz`, `rabbitmq_data.tar.gz`, and `redisdata.tar.gz`. It is a file-level copy of a live database, so schedule it at a quiet time. Copy the folder, and `plane-app/plane.env` (which holds the secrets), somewhere off the machine. If you use external PostgreSQL or S3, back those up with your provider's tools instead.

**Restore.** On a machine where Plane is installed and has been started at least once (so that the volumes exist), and with the stack stopped:

```bash
./setup.sh stop
curl -fsSL -o restore.sh https://github.com/makeplane/plane/releases/latest/download/restore.sh
chmod +x restore.sh
./restore.sh /path/to/plane-app/backup/20260816-0930
./setup.sh start
```

`restore.sh` needs `jq` installed. It recreates each `plane-app_*` volume from the matching archive and refuses to run while the stack is up.

## God Mode and instance settings

Instance-wide settings (SMTP, sign-in methods and OAuth providers, workspace creation, image provider, telemetry) live in God Mode at `<WEB_URL>/god-mode/`, not in `plane.env`. See [Instance admin and God Mode](/self-hosting/govern/instance-admin), [SMTP for email](/self-hosting/govern/communication), and [Authentication](/self-hosting/govern/authentication). To make an existing user an instance admin from the command line:

```bash
docker compose -f plane-app/docker-compose.yaml --env-file plane-app/plane.env \
  exec api python manage.py create_instance_admin <admin-email>
```

## Uninstall

`./setup.sh stop` removes the containers but keeps the data. To delete everything, also remove the volumes and the folder:

```bash
docker compose -f plane-app/docker-compose.yaml --env-file plane-app/plane.env down -v
rm -rf plane-app
```

## Troubleshoot

- **Nothing loads, or the proxy keeps restarting.** `SITE_ADDRESS` names a domain that doesn't resolve here yet, or 80/443 aren't reachable, so certificate issuance fails. Use `SITE_ADDRESS=:80` until DNS is live.
- **CORS errors or links to `localhost`.** `APP_DOMAIN` is still `localhost`, or `WEB_URL`/`CORS_ALLOWED_ORIGINS` use the wrong scheme.
- **The migrator fails.** Bad `DATABASE_URL` (often `localhost`), wrong credentials, or an unsupported PostgreSQL version.
- **Uploads fail or images don't render.** Bucket CORS, `MINIO_ENDPOINT_SSL`, or `AWS_S3_ENDPOINT_URL`. See [Storage errors](/self-hosting/troubleshoot/storage-errors).
- More: [Installation errors](/self-hosting/troubleshoot/installation-errors), [Discord](https://discord.gg/plane), [GitHub issues](https://github.com/makeplane/plane/issues).
