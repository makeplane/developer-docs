---
title: Upgrade from Community to Commercial Edition
description: Upgrade self-hosted Plane to the latest version. Step-by-step guide for updating your Plane installation safely.
keywords: plane, self-hosting, deployment, plane installation, upgrade, migration, update
---

# Upgrade from Community to Commercial Edition

The Commercial edition comes with the free plan and the flexibility to upgrade to a paid plan at any point.

> [!WARNING]
> The instructions provided on this page are specific to installations using Docker. If you are running Plane on Kubernetes, you'll need to manually create a database dump and back up your file storage by copying the relevant volumes or storage paths.

## Prerequisites

- Install the [Commercial Edition](/self-hosting/methods/docker-compose#install-plane) on a fresh machine, not the one running the Plane Community Edition.
- Be sure to log in as the root user or as a user with sudo access. The `/opt` folder requires sudo or root privileges.

:::tabs key:upgrade-options
== Standard setup (built-in DB & storage) {#standard-setup}

This upgrade path is for installations using Plane's default PostgreSQL database and MinIO object storage.

## Back up data on Community instance

1. Download the latest version of `setup.sh`.

   ```bash
   curl -fsSL https://github.com/makeplane/plane/releases/latest/download/setup.sh -o setup.sh
   ```

2. Run the setup.sh backup script to take the backup of the Community Edition instance.

   ```bash
   ./setup.sh backup
   ```

3. When done, your data will be backed up to the folder shown on the screen.
   e.g., `/plane-selfhost/plane-app/backup/20240522-1027`
   This folder will contain 3 `tar.gz` files.
   - `pgdata.tar.gz`
   - `redisdata.tar.gz`
   - `uploads.tar.gz`

4. Copy all the three files from the server running the Community Edition to any folder on the server running the Commercial Edition.

   e.g., `~/ce-backup`

## Restore data on Commercial instance

1. Start any command-line interface like Terminal and go into the folder with the back-up files.
   ```
   cd ~/ce-backup
   ```
2. Copy and paste the script below on Terminal and hit Enter.

   ```
    TARGET_DIR=/opt/plane/data
    sudo mkdir -p $TARGET_DIR
    for FILE in *.tar.gz; do
        if [ -e "$FILE" ]; then
            tar -xzvf "$FILE" -C "$TARGET_DIR"
        else
            echo "No .tar.gz files found in the current directory."
            exit 1
        fi
    done

    mv $TARGET_DIR/pgdata/ $TARGET_DIR/db
    mv $TARGET_DIR/redisdata/ $TARGET_DIR/redis
    mkdir -p $TARGET_DIR/minio
    mv $TARGET_DIR/uploads/ $TARGET_DIR/minio/uploads/
   ```

3. This script will extract your Community Edition data and restore it to `/opt/plane/data`.

== Managed services (external DB and storage) {#managed-services}

This upgrade path is for installations using external or managed database and object storage services (like AWS RDS and S3). Since your data already lives in external services, you only need to update your configuration — no backup and restore required.

## Update configuration for Commercial Edition

1.  Open the `plane.env` file located at `/opt/plane/plane.env`.

2.  Configure database connection.
    1.  Find the `DATABASE_URL` environment variable.
    2.  Verify it points to your external database:

        ```ini
        DATABASE_URL=postgresql://user:password@your-db-host:5432/plane
        ```

        If you need to change it, update the value with your managed database connection string.

    3.  Configure object storage 1. Find the `#DATASTORE SETTINGS` section in `plane.env` 2. Update these environment variables for your external storage:

        ```env
        USE_MINIO=0
        AWS_REGION=us-east-1
        AWS_ACCESS_KEY_ID=<your-access-key>
        AWS_SECRET_ACCESS_KEY=<your-secret-key>
        AWS_S3_ENDPOINT_URL=https://s3.amazonaws.com
        AWS_S3_BUCKET_NAME=plane-uploads
        ```

        :::info
        Setting `USE_MINIO=0` disables the local MinIO service and enables external object storage (S3 or S3-compatible services).
        :::

3.  Restart Plane services to apply the configuration:
    ```bash
    prime-cli restart
    ```

Your Commercial Edition instance is now connected to your existing external database and storage.

## What's next

- [Activate a paid plan license](/self-hosting/manage/manage-licenses/activate-pro-and-business).
