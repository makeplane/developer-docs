---
title: Update a release label
description: Update a release label via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Update a release label

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/labels/{label_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing release label by setting the values of the parameters passed. Any parameters not provided will be left unchanged. The label name must remain unique per workspace (or per project), otherwise the request fails with a 400 `RELEASE_LABEL_NAME_ALREADY_EXISTS` error.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="label_id" type="string" :required="true">

The unique identifier for the release label.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string">

Name of the release label.

</ApiParam>

<ApiParam name="color" type="string">

Hex color code for the label.

</ApiParam>

<ApiParam name="sort_order" type="number">

Sort order for the label.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.labels:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Update a release label" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "color": "#DE350B",
  "sort_order": 5
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'color': '#DE350B',
  'sort_order': 5
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      color: "#DE350B",
      sort_order: 5,
    }),
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "f6a7b8c9-d0e1-2345-fabc-678901234567",
  "name": "Breaking change",
  "color": "#DE350B",
  "sort_order": 5,
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "project": null
}
```

</ResponsePanel>

</div>
</div>
