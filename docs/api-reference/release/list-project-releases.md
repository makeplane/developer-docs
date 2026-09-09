---
title: List all project releases
description: List all releases for a project via Plane API. HTTP GET request with pagination, filtering, and query parameters.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# List all project releases

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/releases/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns a list of all releases scoped to a project.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

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

<CodePanel title="List all project releases" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/releases/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/releases/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/releases/", {
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
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "created_at": "2025-03-01T10:00:00.000000Z",
      "updated_at": "2025-03-05T14:30:00.000000Z",
      "deleted_at": null,
      "name": "v2.4.0",
      "description": {
        "description_html": "<p>Spring feature release.</p>",
        "description_binary": null,
        "description_stripped": "Spring feature release.",
        "description_json": {}
      },
      "status": "unreleased",
      "target_date": "2025-03-31",
      "release_date": null,
      "is_latest": false,
      "is_prerelease": false,
      "external_id": null,
      "external_source": null,
      "created_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
      "updated_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
      "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
      "lead": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
      "tag": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
      "project": "8b2e1c4d-6f3a-4d5e-9c1b-2a3b4c5d6e7f"
    }
  ]
}
```

</ResponsePanel>

</div>
</div>
