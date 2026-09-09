---
title: Add labels to release
description: Create labels to release via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Add labels to release

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/labels/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Adds one or more labels to a release. Labels must be workspace-wide or belong to the release's project, otherwise the request fails with a 400 `RELEASE_LABEL_OUT_OF_SCOPE` error.

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

<ApiParam name="label_ids" type="string[]" :required="true">

Array of release label IDs to add to the release.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Add labels to release" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "label_ids": ["f6a7b8c9-d0e1-2345-fabc-678901234567"]
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'label_ids': ['f6a7b8c9-d0e1-2345-fabc-678901234567']
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      label_ids: ["f6a7b8c9-d0e1-2345-fabc-678901234567"],
    }),
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
[
  {
    "id": "f6a7b8c9-d0e1-2345-fabc-678901234567",
    "name": "Breaking change",
    "color": "#FF5630",
    "sort_order": 10,
    "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
    "project": null
  }
]
```

</ResponsePanel>

</div>
</div>
