---
title: Create a release label
description: Create a release label via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Create a release label

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/labels/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new release label in the workspace label catalog. The label name must be unique per workspace (or per project, when scoped to one), otherwise the request fails with a 400 `RELEASE_LABEL_NAME_ALREADY_EXISTS` error.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Name of the release label.

</ApiParam>

<ApiParam name="color" type="string">

Hex color code for the label. Defaults to `#4E5355`.

</ApiParam>

<ApiParam name="sort_order" type="number">

Sort order for the label. Defaults to 0.

</ApiParam>

<ApiParam name="project" type="string">

ID of the project to scope the label to. When omitted, the label is workspace-wide. This cannot be changed after creation.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.labels:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Create a release label" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Breaking change",
  "color": "#FF5630",
  "sort_order": 10
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'Breaking change',
  'color': '#FF5630',
  'sort_order': 10
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/", {
  method: "POST",
  headers: {
    "X-API-Key": "your-api-key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Breaking change",
    color: "#FF5630",
    sort_order: 10,
  }),
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "f6a7b8c9-d0e1-2345-fabc-678901234567",
  "name": "Breaking change",
  "color": "#FF5630",
  "sort_order": 10,
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "project": null
}
```

</ResponsePanel>

</div>
</div>
