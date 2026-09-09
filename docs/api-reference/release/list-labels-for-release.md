---
title: List labels for a release
description: List labels for a release via Plane API. HTTP GET request with pagination, filtering, and query parameters.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# List labels for a release

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/labels/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns a list of all labels attached to a release.

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

### Query Parameters

<div class="params-list">

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

`releases:read`

</div>

</div>
<div class="api-right">

<CodePanel title="List labels for a release" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/",
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
