---
title: Migrate to external services
description: Move your Plane data from the default local Postgres and MinIO containers to managed cloud services for a production ready deployment.
---

# Migrate to external Postgres and storage

The default Plane installation includes a local PostgreSQL container and a local MinIO container for storage. These are convenient for getting started, but not recommended for production. For production deployments, use a managed database service and an S3-compatible object store.

This guide walks through moving your existing data from the local containers to your cloud-managed services. Follow these steps during a maintenance window as the migration requires Plane to be offline.

## Before you begin

You need:

- Docker and Docker Compose installed on the host running Plane
- The PostgreSQL client `psql` and `pg_restore` installed on your local machine
- Your cloud Postgres connection details: host, username, database name, and password
- Your cloud storage connection details: endpoint URL, access key, secret key, and bucket name

## Stop Plane

Take Plane offline before starting. This prevents new writes during the migration.

```bash
docker compose down
```

Do not stop the database and MinIO containers yet, you still need them running to export data.

Start only the database and MinIO:

```bash
docker compose up -d plane-db plane-minio
```

## Export the database
Run `pg_dump` inside the running database container. This creates a compressed binary dump file in your current directory.

```bash
docker exec \
    -e PGPASSWORD=plane \
    -e PGUSER=plane \
    -e PGDATABASE=plane \
    plane-app-plane-db-1 \
    pg_dump -Fc > plane-backup.dump
```

Verify the file was created and is not empty:

```
ls -lh plane-backup.dump
```

## Restore the database to your cloud Postgres
Use `pg_restore` on your local machine to load the dump into your cloud database. Replace the placeholder values with your actual connection details.

```bash
pg_restore \
    -h "your-cloud-host.com" \
    -U "cloud-username" \
    -d "cloud-database-name" \
    plane-backup.dump
```

You will be prompted for your cloud database password.

## Sync storage to your cloud bucket
MinIO ships with the `mc` client. Use it from inside the MinIO container to sync your local uploads to your cloud storage.

1. Create an alias for your local MinIO.

Your MinIO credentials are in plane.env as AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.

```bash
docker compose --env-file plane.env exec plane-minio \
    mc alias set localminio http://localhost:9000 \
    <MINIO_ROOT_USER> <MINIO_ROOT_PASSWORD>
```

2. Create an alias for your cloud storage.

```bash
docker compose --env-file plane.env exec plane-minio \
    mc alias set cloudminio <cloud-endpoint-url> \
    <CLOUD_ACCESS_KEY> <CLOUD_SECRET_KEY>
```

3. Mirror local data to your cloud bucket.
```bash
docker compose --env-file plane.env exec plane-minio \
    mc mirror localminio/uploads cloudminio/<bucket-name> --overwrite
```

This copies all files from the local uploads bucket to your cloud bucket. The `--overwrite` flag replaces any existing files in the destination with the same name.

Wait for the sync to complete before continuing.

## Update your environment configuration
Open plane.env and update the database and storage settings to point to your cloud services.

### Database

```bash
DATABASE_URL=postgresql://cloud-username:cloud-password@your-cloud-host.com:5432/cloud-database-name
```

### Storage

```bash
AWS_ACCESS_KEY_ID=<CLOUD_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<CLOUD_SECRET_KEY>
AWS_S3_ENDPOINT_URL=<cloud-endpoint-url>
AWS_S3_BUCKET_NAME=<bucket-name>
AWS_REGION = <aws-region>
```

## Restart Plane
Bring all services back up

```bash
docker compose up -d
```

Open Plane in a browser and verify that your data, attachments, and pages are intact.

## After migration
Keep plane-backup.dump in a safe location as a point-in-time backup.


