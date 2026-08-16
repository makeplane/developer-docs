---
title: Backup and restore data
description: Backup and restore Plane data. Complete guide for backing up database, storage, and configuration files.
keywords: plane backup, plane restore, database backup, postgresql backup, data recovery, plane data export, self-hosting
---

# Backup and restore data <EditionBadge edition="commercial" />

Backing up your data regularly helps prevent data loss and allows you to restore your system quickly if necessary. Follow these instructions to back up and restore your data using Plane’s command-line interface.

## For Docker Compose

### Backup data

::: warning
**Prime CLI is for Docker installations only.** These commands only work on Plane instances originally installed using `prime-cli`.
:::

Create a backup of your Plane data with ↓:

```bash
sudo prime-cli backup
```

This command initiates a full backup of all critical data, storing it in the default backup location at:

```bash
/opt/plane/backups
```

Each backup file will be timestamped to ensure you can easily identify the latest or a specific backup if needed.

### Backup plane.env {#backup-plane-env}

If you need to back up only the `plane.env` file, you'll need to do it manually. Here’s how:

1. Navigate to the `/opt/plane` folder on your machine or server where Plane is installed..
2. Locate the `plane.env` file.
3. Copy this file to a different location as a backup, so you can restore it if needed.

### Restore data

You can restore your data from a previous backup with ↓:

```bash
sudo prime-cli restore
```

This command prompts the restoration process, which will overwrite the current data with the data from the most recent backup file. Ensure you have selected the correct backup before running this command, as restoring will replace your current data.

## Community Edition

Community Edition instances are backed up with `./setup.sh backup` and restored with the `restore.sh` script from the release. See [Community Edition → Back up and restore](/self-hosting/community/manage#back-up-and-restore).

## Other deployment methods

For Kubernetes, or other deployment methods, use your platform's native backup tools. Plane stores data in two places that need to be backed up:

| Component               | What it contains                                                            |
| ----------------------- | --------------------------------------------------------------------------- |
| **PostgreSQL database** | All Plane data: workspaces, projects, work items, users, comments, settings |
| **Object storage**      | Attachments, uploaded images, files (MinIO, S3, or S3-compatible storage)   |

### Configuration files

Also back up your environment configuration. It includes database connection strings, storage credentials, and other settings.

- **Kubernetes:** Helm values file, ConfigMaps, and Secrets
- **Other platforms:** Environment variables or configuration files specific to your setup

:::tip
Store backups in a separate location from your Plane installation, ideally offsite or in a different cloud region.
:::
