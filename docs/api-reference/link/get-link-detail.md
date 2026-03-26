---
title: Retrieve a link
description: Get retrieve a link details via Plane API. Retrieve complete information for a specific resource.
keywords: plane api, get link detail, retrieve link, work item link, issue link, rest api, api integration
---

# Retrieve a link

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/links/{link_id}</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieves the details of an existing link by its ID.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

</ApiParam>

<ApiParam name="work_item_id" type="string" :required="true">

The unique identifier for the work item.

</ApiParam>

<ApiParam name="link_id" type="string" :required="true">

The unique identifier for the link.

</ApiParam>

</div>
</div>

<div class="params-section">

### Query Parameters

<div class="params-list">

<ApiParam name="cursor" type="string" :required="false">

Pagination cursor for getting next set of results

</ApiParam>

<ApiParam name="expand" type="string" :required="false">

Comma-separated list of related fields to expand in response

</ApiParam>

<ApiParam name="fields" type="string" :required="false">

Comma-separated list of fields to include in response

</ApiParam>

<ApiParam name="per_page" type="integer" :required="false">

Number of results per page (default: 20, max: 100)

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items.links:read`

</div>


</div>

<div class="api-right">

<CodePanel title="Retrieve a link" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/links/{link_id}?cursor=20:1:0&expand=assignees" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/links/{link_id}?cursor=20:1:0&expand=assignees",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/links/{link_id}?cursor=20:1:0&expand=assignees", {
  method: "GET",
  headers: {
    "X-API-Key": "your-api-key"
  },
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "grouped_by": "state",
  "sub_grouped_by": "priority",
  "total_count": 150,
  "next_cursor": "20:1:0",
  "prev_cursor": "20:0:0",
  "next_page_results": true,
  "prev_page_results": false,
  "count": 20,
  "total_pages": 8,
  "total_results": 150,
  "extra_stats": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Example Name",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

</ResponsePanel>

</div>

</div>
