---
title: Download version config
description: Download docker-compose.yml and variables.env files for a given Plane release as a zip archive.
keywords: plane, plane api, setup, docker compose, self-hosting, config download, version config, airgapped
---

# Download version config

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v2/setup/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Download `docker-compose.yml` and `variables.env` files for a given Plane release as a zip archive.

**Authentication:** None required (public endpoint)

**Base URL:** `https://prime.plane.so`

<div class="params-section">

### Query Parameters

<div class="params-list">

<ApiParam name="version" type="string" :required="true">

Release tag name (e.g. `v0.23.0`).

</ApiParam>

<ApiParam name="airgapped" type="boolean">

Set to `true` to get airgapped compose files. Defaults to `false`.

</ApiParam>

<ApiParam name="platform" type="string">

Target architecture: `amd64` or `arm64`. Defaults to `amd64`. Only relevant when `airgapped` is `true`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Response

**Success (200):** Returns a zip file download containing the config files for the requested release.

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

### Error Responses

| Status | Condition                                     | Body                                                    |
| ------ | --------------------------------------------- | ------------------------------------------------------- |
| 400    | `version` query param missing                 | `{"error": "version query parameter is required"}`      |
| 400    | `platform` is not `amd64` or `arm64`          | `{"error": "platform must be amd64 or arm64"}`          |
| 400    | Server missing GitHub configuration           | `{"error": "missing required settings"}`                |
| 404    | Release tag not found on GitHub               | `{"error": "release not found"}`                        |
| 404    | Required asset files missing from the release | `{"error": "assets not found in release: <filenames>"}` |
| 500    | GitHub API failure                            | `{"error": "Failed to fetch release information"}`      |

</div>

</div>
<div class="api-right">

<CodePanel title="Download version config" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
# Download standard config files
curl "https://prime.plane.so/api/v2/setup/?version=v0.23.0" \
  -o plane.zip

# Download airgapped config (AMD64)
curl "https://prime.plane.so/api/v2/setup/?version=v0.23.0&airgapped=true" \
  -o plane.zip

# Download airgapped config (ARM64)
curl "https://prime.plane.so/api/v2/setup/?version=v0.23.0&airgapped=true&platform=arm64" \
  -o plane.zip

# Verify zip contents without extracting
curl "https://prime.plane.so/api/v2/setup/?version=v0.23.0" \
  -o plane.zip && unzip -l plane.zip
```

</template>
<template #python>

```python
import requests

# Download standard config files
response = requests.get(
    "https://prime.plane.so/api/v2/setup/",
    params={"version": "v0.23.0"},
)

with open("plane.zip", "wb") as f:
    f.write(response.content)

# Download airgapped config (ARM64)
response = requests.get(
    "https://prime.plane.so/api/v2/setup/",
    params={
        "version": "v0.23.0",
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
const response = await fetch(
  "https://prime.plane.so/api/v2/setup/?version=v0.23.0"
);
const blob = await response.blob();

// Download airgapped config (ARM64)
const airgappedResponse = await fetch(
  "https://prime.plane.so/api/v2/setup/?version=v0.23.0&airgapped=true&platform=arm64"
);
const airgappedBlob = await airgappedResponse.blob();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```
Content-Type: application/zip
Content-Disposition: attachment; filename="plane-v0.23.0.zip"

Archive contents (standard):
  - docker-compose.yml
  - variables.env

Archive contents (airgapped, amd64):
  - airgapped-docker-compose-amd64.yml
  - variables.env
```

</ResponsePanel>

<ResponsePanel status="400">

```json
{
  "error": "version query parameter is required"
}
```

</ResponsePanel>

<ResponsePanel status="404">

```json
{
  "error": "release not found"
}
```

</ResponsePanel>

</div>
</div>
