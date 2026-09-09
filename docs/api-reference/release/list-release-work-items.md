---
title: List all work items in a release
description: List all work items in a release via Plane API. HTTP GET request with pagination, filtering, and query parameters.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# List all work items in a release

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/work-items/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns a list of all work items linked to a release.

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

`releases.work_items:read`

</div>

</div>
<div class="api-right">

<CodePanel title="List all work items in a release" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/",
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
  "count": 2,
  "total_pages": 1,
  "total_results": 2,
  "extra_stats": null,
  "results": [
    {
      "id": "d4e5f6a7-b8c9-0123-defa-456789012345",
      "project_id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
      "name": "Fix login redirect"
    },
    {
      "id": "e5f6a7b8-c9d0-1234-efab-567890123456",
      "project_id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
      "name": "Add SSO support for enterprise plan"
    }
  ]
}
```

</ResponsePanel>

</div>
</div>
