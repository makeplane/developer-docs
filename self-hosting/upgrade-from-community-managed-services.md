---
title: Upgrade from Community to Commercial Edition
sidebarTitle: Upgrade to Commercial Edition
---

This guide walks you through updating your configuration to migrate existing data from a **Community** setup to a **Commercial** environment.

## Step 1: Navigate to the Plane directory

```bash
cd /opt/plane
```

## Step 2: Open the environment configuration file

```bash
vim plane.env
```

## Step 3: Update the database connection

1. Search for the `DATABASE_URL` environment variable.

2. Replace the existing value with your **remote (managed) database URL**.

Example:

```env
DATABASE_URL=postgres://user:password@remote-host:5432/dbname
```

## Step 4: Update datastore (object storage) settings

1. Search for the `#DATASTORE SETTINGS` section in `plane.env`.

2. Update the following environment variables as required for your managed storage setup:

```env
USE_MINIO=0
AWS_REGION=<your-region>
AWS_ACCESS_KEY_ID=<access-key>
AWS_SECRET_ACCESS_KEY=<secret-key>
AWS_S3_ENDPOINT_URL=<s3-endpoint-url>
AWS_S3_BUCKET_NAME=uploads
```

> ⚠ Setting `USE_MINIO=0` disables the local MinIO service and enables external object storage (e.g., S3 or S3-compatible services).

## Step 5: Restart Plane services

Apply the changes by restarting the services:

```bash
prime-cli restart
```