---
title: Download config files
description: Get the Docker Compose files, environment templates, and platform bundles for any Plane Commercial Edition release from prime.plane.so, for Swarm, Portainer, Coolify, Podman, airgapped, or custom deployments.
keywords: plane docker-compose.yml download, plane variables.env, prime.plane.so releases, plane setup api, plane compose files, download plane config
---

# Download config files <EditionBadge edition="commercial" />

If you don't use the Prime CLI (Swarm, Portainer, Coolify, Podman, airgapped, or a custom setup), download the deployment files for a specific release from `prime.plane.so`. Always pin a release. The current one is **%%COMMERCIAL_VERSION%%** ([Versions and releases](/self-hosting/versions)).

## Direct downloads

```
https://prime.plane.so/releases/<version>/<file>
```

| File                           | Used by                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `docker-compose.yml`           | Custom Docker Compose deployments (the file the Prime CLI installs)           |
| `variables.env`                | Environment template for all Docker-based deployments. Save it as `plane.env` |
| `swarm-compose.yml`            | [Docker Swarm](/self-hosting/methods/docker-swarm)                            |
| `portainer-compose.yml`        | [Portainer](/self-hosting/methods/portainer)                                  |
| `coolify-compose.yml`          | [Coolify](/self-hosting/methods/coolify)                                      |
| `podman-quadlets.tar.gz`       | [Podman Quadlets](/self-hosting/methods/podman-quadlets)                      |
| `docker-compose-airgapped.yml` | [Airgapped on Docker](/self-hosting/methods/airgapped-edition)                |
| `variables-airgapped.env`      | Environment template for the airgapped Compose file. Save it as `plane.env`   |

Example:

```bash
curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/docker-compose.yml -o docker-compose.yml
curl -fsSL https://prime.plane.so/releases/%%COMMERCIAL_VERSION%%/variables.env -o plane.env
```

No authentication is required. Replace `%%COMMERCIAL_VERSION%%` with the release you need. Releases are listed in the [changelog](https://plane.so/changelog?category=self-hosted).

## Zip download API

The same standard files are also available as a zip:

```bash
curl "https://prime.plane.so/api/v2/setup/?version=%%COMMERCIAL_VERSION%%" -o plane.zip
unzip plane.zip     # docker-compose.yml, variables.env
```

| Parameter   | Required | Default | Description                                            |
| ----------- | -------- | ------- | ------------------------------------------------------ |
| `version`   | Yes      |         | Release tag, for example `%%COMMERCIAL_VERSION%%`      |
| `airgapped` | No       | `false` | `true` for the airgapped Compose file                  |
| `platform`  | No       | `amd64` | `amd64` or `arm64`. Only applies when `airgapped=true` |

For airgapped files, use the direct downloads above (`docker-compose-airgapped.yml`, `variables-airgapped.env`). They are available for every release.

| Status | Cause                             | Response                                                |
| ------ | --------------------------------- | ------------------------------------------------------- |
| 400    | Missing `version` parameter       | `{"error": "version query parameter is required"}`      |
| 400    | Invalid `platform` value          | `{"error": "platform must be amd64 or arm64"}`          |
| 404    | Release tag not found             | `{"error": "release not found"}`                        |
| 404    | Config files missing from release | `{"error": "assets not found in release: <filenames>"}` |
| 500    | GitHub API failure                | `{"error": "Failed to fetch release information"}`      |

## What to do with the files

1. Save `variables.env` as `plane.env` and set at least `APP_RELEASE_VERSION`, `DOMAIN_NAME`, `SITE_ADDRESS`, `WEB_URL`, `CORS_ALLOWED_ORIGINS`, `MACHINE_SIGNATURE` (`openssl rand -hex 16`), and your own secrets. See [Environment variables](/self-hosting/govern/environment-variables).
2. Deploy with the tool of your choice, for example `docker compose --env-file plane.env up -d`.
3. Continue with [After you install](/self-hosting/methods/after-install).
