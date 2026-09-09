---
title: Update a release changelog
description: Update a release changelog via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Update a release changelog

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/changelog/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates the changelog for a release by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

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

<ApiParam name="description_html" type="string">

HTML content for the changelog. Write-only; the stored value is returned in the response as the nested `changelog` object.

</ApiParam>

<ApiParam name="description_json" type="object">

Rich-text JSON content for the changelog. Write-only; the stored value is returned in the response as the nested `changelog` object.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Update a release changelog" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/release-uuid/changelog/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "description_html": "<p>Added dark mode. Fixed login redirect loop.</p>",
  "description_json": {}
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/release-uuid/changelog/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'description_html': '<p>Added dark mode. Fixed login redirect loop.</p>',
  'description_json': {}
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/releases/release-uuid/changelog/", {
  method: "PATCH",
  headers: {
    "X-API-Key": "your-api-key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    description_html: "<p>Added dark mode. Fixed login redirect loop.</p>",
    description_json: {},
  }),
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "5d4c3b2a-1908-4756-8fed-cba987654321",
  "created_at": "2025-03-01T10:05:00.000000Z",
  "updated_at": "2025-03-06T09:10:00.000000Z",
  "deleted_at": null,
  "changelog": {
    "description_html": "<p>Added dark mode. Fixed login redirect loop.</p>",
    "description_binary": null,
    "description_stripped": "Added dark mode. Fixed login redirect loop.",
    "description_json": {}
  },
  "created_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "updated_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "release": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

</ResponsePanel>

</div>
</div>
