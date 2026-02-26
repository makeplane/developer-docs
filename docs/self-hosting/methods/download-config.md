---
title: Download version config
description: Download docker-compose.yml and variables.env files for a given Plane release as a zip archive.
keywords: plane, self-hosting, setup, docker compose, config download, version config, airgapped, variables.env
---

# Download version config

Download `docker-compose.yml` and `variables.env` files for a given Plane release as a zip archive.

## Endpoint

```
GET https://prime.plane.so/api/v2/setup/
```

```bash
curl "https://prime.plane.so/api/v2/setup/?version=<version>&airgapped=<true|false>&platform=<amd64|arm64>" -o plane.zip
```

| Option     | Required | Default | Description                                  |
| ---------- | -------- | ------- | -------------------------------------------- |
| `version`  | Yes      | —       | Release tag name (e.g. `v2.3.4`)            |
| `airgapped`| No       | `false` | Set to `true` to get airgapped compose files |
| `platform` | No       | `amd64` | Target architecture: `amd64` or `arm64`      |

**Authentication:** None required (public endpoint)

## Query Parameters

| Parameter   | Required | Default | Description                                  |
| ----------- | -------- | ------- | -------------------------------------------- |
| `version`   | Yes      | —       | Release tag name (e.g. `v2.3.4`)            |
| `airgapped` | No       | `false` | Set to `true` to get airgapped compose files |
| `platform`  | No       | `amd64` | Target architecture: `amd64` or `arm64`      |

## Response

**Success (200):** A zip file download containing the config files for the requested release.

- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename="plane-{version}.zip"`

### Zip contents by mode

**Standard** (`airgapped=false` or omitted):

- `docker-compose.yml`
- `variables.env`

**Airgapped** (`airgapped=true`):

- `airgapped-docker-compose-{platform}.yml`
- `variables.env`

## Examples

### Download standard config files

```bash
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4" -o plane.zip
unzip plane.zip
```

### Download airgapped config (AMD64)

```bash
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4&airgapped=true" -o plane.zip
```

### Download airgapped config (ARM64)

```bash
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4&airgapped=true&platform=arm64" -o plane.zip
```

### Verify zip contents without extracting

```bash
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4" -o plane.zip && unzip -l plane.zip
```

## Error Responses

| Status | Condition                                     | Body                                                    |
| ------ | --------------------------------------------- | ------------------------------------------------------- |
| 400    | `version` query param missing                 | `{"error": "version query parameter is required"}`      |
| 400    | `platform` is not `amd64` or `arm64`          | `{"error": "platform must be amd64 or arm64"}`          |
| 400    | Server missing GitHub configuration           | `{"error": "missing required settings"}`                |
| 404    | Release tag not found on GitHub               | `{"error": "release not found"}`                        |
| 404    | Required asset files missing from the release | `{"error": "assets not found in release: <filenames>"}` |
| 500    | GitHub API failure                            | `{"error": "Failed to fetch release information"}`      |
