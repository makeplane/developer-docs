---
title: Update Plane version
description: Upgrade self-hosted Plane to the latest version. Step-by-step guide for updating your Plane installation safely.
keywords: plane version upgrade, update plane, plane latest version, upgrade guide, self-hosting update, plane migration
---

# Update Plane version <EditionBadge edition="commercial" />

Keeping Plane up to date ensures you’re using the latest features, improvements, and security fixes. Here’s how to upgrade your Plane installation with a single command.

::: info
The upgrade process may involve a brief downtime as services are updated and restarted.
:::

## Prerequisites

We recommend creating a backup of your data before any version updates. See [Backup data](/self-hosting/manage/backup-restore).

## Check version

You can quickly check your Plane version by clicking the **?** icon on the sidebar.

![Check version number](https://media.docs.plane.so/product/check-version.webp#hero)

## Update version

::: warning
Make sure the machine runs Docker Engine 24 or later with the **Compose v2 plugin**. Check with `docker compose version` (with a space). The legacy `docker-compose` v1 binary is not supported.

**Prime CLI is for Docker installations only.** These commands only work on Plane instances originally installed using `prime-cli`.
:::

1. Update your Prime CLI with the command ↓:

   ```bash
   sudo prime-cli update-cli
   ```

   The latest version of the CLI ensures your Plane upgrades happen smoothly.

2. To update Plane to the latest version, run:
   ```bash
   sudo prime-cli upgrade
   ```
   This command checks for the latest version of Plane and applies the upgrade if a new version is available.

## Community Edition

Community Edition instances are upgraded with `./setup.sh upgrade` followed by `./setup.sh start`. See [Community Edition → Upgrade](/self-hosting/community/manage#upgrade).
