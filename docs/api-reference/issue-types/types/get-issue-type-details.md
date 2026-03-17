---
title: Retrieve a work item type
description: Retrieve a work item type via Plane API. HTTP request format, parameters, scopes, and example responses for retrieve a work item type.
keywords: plane, plane api, rest api, api integration, issue types, types, retrieve a work item type
---

# Retrieve a work item type

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-item-types/{type_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve an issue type by id

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

<ApiParam name="type_id" type="string" :required="true">

Type id.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_item_types:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Retrieve a work item type" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/550e8400-e29b-41d4-a716-446655440001/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/550e8400-e29b-41d4-a716-446655440001/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/550e8400-e29b-41d4-a716-446655440001/",
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
```

</ResponsePanel>

</div>

</div>
