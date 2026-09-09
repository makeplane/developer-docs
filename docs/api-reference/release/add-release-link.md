---
title: Create a release link
description: Create a release link via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Create a release link

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/links/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new link attached to a release.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="release_id" type="string" :required="true">

The unique identifier for the release.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="title" type="string" :required="true">

Title or description of the link.

</ApiParam>

<ApiParam name="url" type="string" :required="true">

URL of the external resource. Must be unique within the release.

</ApiParam>

<ApiParam name="metadata" type="object">

Arbitrary metadata to store alongside the link. Defaults to `{}`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.links:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Create a release link" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/links/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "title": "Release notes",
  "url": "https://example.com/releases/v2.4.0",
  "metadata": {}
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/links/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'title': 'Release notes',
  'url': 'https://example.com/releases/v2.4.0',
  'metadata': {}
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/links/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Release notes",
      url: "https://example.com/releases/v2.4.0",
      metadata: {},
    }),
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
  "created_at": "2025-03-03T11:00:00.000000Z",
  "updated_at": "2025-03-03T11:00:00.000000Z",
  "deleted_at": null,
  "title": "Release notes",
  "url": "https://example.com/releases/v2.4.0",
  "metadata": {},
  "created_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "updated_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "release": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

</ResponsePanel>

</div>
</div>
