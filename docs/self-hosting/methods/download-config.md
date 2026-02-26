---
title: Download Docker config files
description: Download docker-compose.yml and variables.env files for a specific Plane release as a zip archive.
keywords: plane, self-hosting, setup, docker compose, config download, version config, airgapped, variables.env
---

# Download Docker config files

If you're running a custom Docker setup and don't use `prime-cli`, you can download the `docker-compose.yml` and `variables.env` files for any Plane release directly.

## Quick download

**Standard setup**

```bash
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4" -o plane.zip
unzip plane.zip
```

**Airgapped setup (AMD64)**

```bash
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4&airgapped=true" -o plane.zip
unzip plane.zip
```

**Airgapped setup (ARM64)**

```bash
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4&airgapped=true&platform=arm64" -o plane.zip
unzip plane.zip
```

Replace `v2.3.4` with the version you need. See the [releases page](https://plane.so/changelog?category=self-hosted) for available versions.

## What's in the zip

**Standard download**
- `docker-compose.yml`
- `variables.env`

**Airgapped download**
- `airgapped-docker-compose-{platform}.yml`
- `variables.env`

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `version` | Yes | — | Release tag (e.g., `v2.3.4`) |
| `airgapped` | No | `false` | Set to `true` for airgapped compose files |
| `platform` | No | `amd64` | Target architecture: `amd64` or `arm64`. Only applies when `airgapped=true`. |

### Error responses

| Status | Cause | Response |
|--------|-------|----------|
| 400 | Missing `version` parameter | `{"error": "version query parameter is required"}` |
| 400 | Invalid `platform` value | `{"error": "platform must be amd64 or arm64"}` |
| 400 | Server missing GitHub configuration | `{"error": "missing required settings"}` |
| 404 | Release tag not found | `{"error": "release not found"}` |
| 404 | Config files missing from release | `{"error": "assets not found in release: <filenames>"}` |
| 500 | GitHub API failure | `{"error": "Failed to fetch release information"}` |

