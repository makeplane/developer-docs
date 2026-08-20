---
title: Download a workspace page attachment
description: Download an uploaded workspace page attachment through a presigned redirect.
keywords: plane, plane api, workspace page, download attachment
---

# Download a workspace page attachment

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/attachments/{attachment_id}/download/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Validate access and receive a `302` redirect to a temporary presigned download URL. An attachment that has not been confirmed as uploaded returns `400`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace's unique slug.

</ApiParam>
<ApiParam name="page_id" type="string" :required="true">

The workspace page UUID.

</ApiParam>
<ApiParam name="attachment_id" type="string" :required="true">

The attachment asset UUID.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`read` or `wiki.pages:read`

</div>

</div>

<div class="api-right">
<CodePanel title="Download an attachment" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
download_url="$(
  curl --fail --silent --show-error --dump-header - --output /dev/null \
    "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/download/" \
    -H "X-API-Key: $PLANE_API_KEY" \
    | sed -n 's/^Location: \(https:\/\/.*\)\r$/\1/p'
)"
test -n "$download_url"
curl --fail --location "$download_url" --output diagram.png
```

</template>
<template #python>

```python
from urllib.parse import urlparse

import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/download/",
    headers={"X-API-Key": "your-api-key"},
    allow_redirects=False,
)
response.raise_for_status()
download_url = response.headers["Location"]
if urlparse(download_url).scheme != "https":
    raise ValueError("Expected an HTTPS download URL")

with requests.get(download_url, stream=True) as download:
    download.raise_for_status()
    with open("diagram.png", "wb") as output:
        for chunk in download.iter_content(chunk_size=8192):
            output.write(chunk)
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
import { writeFile } from "node:fs/promises";

const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/download/",
  { headers: { "X-API-Key": process.env.PLANE_API_KEY }, redirect: "manual" }
);
if (response.status !== 302) throw new Error(`Expected a redirect, received ${response.status}`);

const downloadUrl = new URL(response.headers.get("location"));
if (downloadUrl.protocol !== "https:") throw new Error("Expected an HTTPS download URL");

const download = await fetch(downloadUrl);
if (!download.ok) throw new Error(`Download failed with ${download.status}`);
await writeFile("diagram.png", Buffer.from(await download.arrayBuffer()));
```

</template>
</CodePanel>
<ResponsePanel status="302">

The `Location` header contains the temporary presigned download URL.

</ResponsePanel>

</div>

</div>
