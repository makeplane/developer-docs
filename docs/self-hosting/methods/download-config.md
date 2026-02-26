---
title: Download version config
description: Download docker-compose.yml and variables.env files for a specific Plane release as a zip archive.
keywords: plane, self-hosting, setup, docker compose, config download, version config, airgapped, variables.env
---

# Download version config

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

Replace `v2.3.4` with the version you need. See the [releases page](https://plane.so/changelog?category=self-hosteds) for available versions.

## What's in the zip

**Standard download**
- `docker-compose.yml`
- `variables.env`

**Airgapped download**
- `airgapped-docker-compose-{platform}.yml`
- `variables.env`

---

## API reference

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v2/setup/</span>
</div>

<div class="api-two-column">
<div class="api-left">

**Base URL:** `https://prime.plane.so`

**Authentication:** Not required (public endpoint)

<div class="params-section">

### Query parameters

<div class="params-list">

<ApiParam name="version" type="string" :required="true">

Release tag (e.g., `v2.3.4`).

</ApiParam>

<ApiParam name="airgapped" type="boolean">

Set to `true` for airgapped compose files. Defaults to `false`.

</ApiParam>

<ApiParam name="platform" type="string">

Target architecture: `amd64` or `arm64`. Defaults to `amd64`. Only applies when `airgapped=true`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Response

**Success (200):** Returns a zip archive containing the config files.

- Content-Type: `application/zip`
- Content-Disposition: `attachment; filename="plane-{version}.zip"`

**Standard** (`airgapped=false` or omitted):

- `docker-compose.yml`
- `variables.env`

**Airgapped** (`airgapped=true`):

- `airgapped-docker-compose-{platform}.yml`
- `variables.env`

</div>

<div class="params-section">

### Errors

| Status | Cause | Response |
|--------|-------|----------|
| 400 | Missing `version` parameter | `{"error": "version query parameter is required"}` |
| 400 | Invalid `platform` value | `{"error": "platform must be amd64 or arm64"}` |
| 400 | Server missing GitHub configuration | `{"error": "missing required settings"}` |
| 404 | Release tag not found | `{"error": "release not found"}` |
| 404 | Config files missing from release | `{"error": "assets not found in release: <filenames>"}` |
| 500 | GitHub API failure | `{"error": "Failed to fetch release information"}` |

</div>

</div>
<div class="api-right">

<CodePanel :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
# Download standard config files
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4" \
  -o plane.zip

# Download airgapped config (AMD64)
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4&airgapped=true" \
  -o plane.zip

# Download airgapped config (ARM64)
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4&airgapped=true&platform=arm64" \
  -o plane.zip

# Verify zip contents without extracting
curl "https://prime.plane.so/api/v2/setup/?version=v2.3.4" \
  -o plane.zip && unzip -l plane.zip
```

</template>
<template #python>

```python
import requests

# Download standard config files
response = requests.get(
    "https://prime.plane.so/api/v2/setup/",
    params={"version": "v2.3.4"},
)

with open("plane.zip", "wb") as f:
    f.write(response.content)

# Download airgapped config (ARM64)
response = requests.get(
    "https://prime.plane.so/api/v2/setup/",
    params={
        "version": "v2.3.4",
        "airgapped": "true",
        "platform": "arm64",
    },
)

with open("plane.zip", "wb") as f:
    f.write(response.content)
```

</template>
<template #javascript>

```javascript
// Download standard config files
const response = await fetch("https://prime.plane.so/api/v2/setup/?version=v2.3.4");
const blob = await response.blob();

// Download airgapped config (ARM64)
const airgappedResponse = await fetch(
  "https://prime.plane.so/api/v2/setup/?version=v2.3.4&airgapped=true&platform=arm64"
);
const airgappedBlob = await airgappedResponse.blob();
```

</template>
</CodePanel>

</div>
</div>
