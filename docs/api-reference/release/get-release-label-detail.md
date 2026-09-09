---
title: Retrieve a release label
description: Get retrieve a release label details via Plane API. Retrieve complete information for a specific resource.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Retrieve a release label

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/labels/{label_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieves the details of an existing release label by its ID.

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

### Scopes

`releases.labels:read`

</div>

</div>
<div class="api-right">

<CodePanel title="Retrieve a release label" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/",
  {
    method: "GET",
    headers: {
      "X-API-Key": "your-api-key",
    },
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
  "color": "#FF5630",
  "sort_order": 10,
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "project": null
}
```

</ResponsePanel>

</div>
</div>
