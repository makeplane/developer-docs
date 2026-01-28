---
title: Search work items
description: Search work items via Plane API. Full-text search with filters and advanced query parameters.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks
---


# Search work items

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/work-items/search/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Searches for work items across a workspace by text query.

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

<ApiParam name="search" type="string" :required="true">

Text query to search for in work item names and descriptions.

</ApiParam>

<ApiParam name="project" type="string">

Filter results to a specific project by ID.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Search work items" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/work-items/search/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/work-items/search/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/work-items/search/",
  {
    method: "GET",
    headers: {
      "X-API-Key": "your-api-key"
    }
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "work-item-uuid",
  "name": "Work Item Title",
  "state": "state-uuid",
  "priority": 2,
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
