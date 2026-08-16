---
title: Command line tools
description: Use Plane Prime CLI for managing your self-hosted instance. Commands for setup, configuration, upgrades, and troubleshooting from the terminal.
keywords: plane cli, prime cli, command line tools, plane management, plane setup commands, self-hosting, plane terminal
---

# Command line tools

Our command-line tool is here to make managing your Plane instance simple. You can handle installs, upgrades, and general management without needing to be a Docker expert.

## Prime CLI <EditionBadge edition="commercial" /> <Badge type="tip" text="Docker" />

The Prime CLI provides commands for common tasks like configuring services, monitoring health, managing backups, and upgrading your Plane instance.

::: warning
**Prime CLI is for Docker installations only.** These commands only work on Plane instances originally installed using `prime-cli`.
:::

Bring up the Prime CLI with `sudo prime-cli` from any directory on your machine.

- The three operators you will use the most are:
  - `start`
    You will use this to start a service in the Docker network with the name of the service.

  - `stop`
    You will use this to stop a service in the Docker network with the name of the service.

  - `restart`
    You will use this to restart a service in the Docker network with the name of the service as a `{param or flag}`.

- Often, you will want to monitor the health of your instance and see if some services are up or down. Use `monitor` to do that.

- `healthcheck` is another useful utility that lets you see the status and errors, if any, of all running services

- `repair` automatically diagnoses and fixes common errors in your Plane instance. This command also resets all configuration values in the plane.env file to their defaults.

- `update-cli` downloads and installs the latest version of Prime CLI.
  ::: tip
  It is highly recommend to run this first before you download any Plane updates. The latest version of the CLI ensures your Plane upgrades happen smoothly.
  :::

For more advanced admins that want greater control over their instance, the list of additional commands available on Prime CLI follow.

- `configure`
  Brings up a step form to let you specify the following.

::: details Steps to configure your instance

- `Listening port`  
  Specify the port that the built-in reverse proxy will use

  Default value: `80`

- `Max file-upload size`  
  Specify a size in MBs for how big each file uploaded to your Plane app can be

  Default value: `5 MB`

- `External Postgres URL`
  Specify the URL of your own hosted Postgres if you would like to change the database your Plane app uses.

Default database: PostgreSQL 15.7 in the bundled Docker container

- `External Redis URL`
  Specify the URL of your own hosted Redis if you would like to change the default Redis Plane ships with.

Default Redis: Valkey 7.2 (Redis-compatible) in the bundled Docker container

- `External storage`
  Specify your AWS S3 bucket's credentials in the format below to change storage from the default Plane ships with.
- AWS Access Key ID
- AWS Secret Access Key
- AWS S3 Bucket Name

Default storage: MinIO

- Confirm your choices on the screen ↓.
  This restarts your instance with the new configs.
  :::

- `upgrade`

checks your instance for available version upgrades and asks you for a confirmation before downloading the latest available version.

1. Typing `YES` lets the CLI automatically download's the latest version and installs it. Then it restarts the instance to load the latest app.
2. Typing `NO` cancels the upgrade.

- `uninstall`

uninstalls Plane. Before it goes through, it asks you for a confirmation.

1. Typing `YES` lets the CLI clean up the `/opt/plane` folder, leaving behind the `/opt/plane/data` and `/opt/plane/logs` folders.
2. Typing `NO` cancels the uninstall.

## Community Edition: setup.sh

The Community Edition is managed with the menu-driven `setup.sh` script instead of the Prime CLI. See [Community Edition → Manage your instance](/self-hosting/community/manage#the-setup-sh-script).

## Troubleshoot

- [Failed to update Prime CLI](/self-hosting/troubleshoot/cli-errors#failed-to-update-prime-cli)
