---
title: List all release labels
description: List all release labels via Plane API. HTTP GET request with pagination, filtering, and query parameters.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# List all release labels

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/labels/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns a list of all release labels in the workspace label catalog, ordered by `sort_order`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Query Parameters

<div class="params-list">

<ApiParam name="project_id" type="string">

Return labels owned by this project. When omitted, only workspace-wide labels are returned.

</ApiParam>

<ApiParam name="per_page" type="number">

Number of results per page. Defaults to 20.

</ApiParam>

<ApiParam name="cursor" type="string">

Cursor string for pagination in the format `value:offset:is_prev`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.labels:read`

</div>

</div>
<div class="api-right">

<CodePanel title="List all release labels" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/", {
  method: "GET",
  headers: {
    "X-API-Key": "your-api-key",
  },
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "next_cursor": "20:1:0",
  "prev_cursor": "",
  "next_page_results": false,
  "prev_page_results": false,
  "count": 1,
  "total_pages": 1,
  "total_results": 1,
  "extra_stats": null,
  "results": [
    {
      "id": "f6a7b8c9-d0e1-2345-fabc-678901234567",
      "name": "Breaking change",
      "color": "#FF5630",
      "sort_order": 10,
      "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
      "project": null
    }
  ]
}
```

</ResponsePanel>

</div>
</div>
