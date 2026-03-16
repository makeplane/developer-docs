---
title: List all work item types
description: List all work item types via Plane API. HTTP request format, parameters, scopes, and example responses for list all work item types.
keywords: plane, plane api, rest api, api integration, issue types, types, list all work item types
---

# List all work item types

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-item-types/</span>
</div>

<div class="api-two-column">
<div class="api-left">

List all issue types for a project

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_item_types:read`

</div>

</div>

<div class="api-right">

<CodePanel title="List all work item types" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/",
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
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "name": "Example Name",
    "description": "Example description",
    "deleted_at": "2024-01-01T00:00:00Z",
    "project_ids": ["550e8400-e29b-41d4-a716-446655440000"],
    "logo_props": "example-value",
    "is_epic": true,
    "is_default": true,
    "is_active": true,
    "level": 1
  }
]
```

</ResponsePanel>

</div>

</div>
