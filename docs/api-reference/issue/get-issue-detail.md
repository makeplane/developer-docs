---
title: Retrieve a work item by ID
description: Retrieve a work item by ID via Plane API. HTTP request format, parameters, scopes, and example responses for retrieve a work item by id.
keywords: plane, plane api, rest api, api integration, issue, retrieve a work item by id
---

# Retrieve a work item by ID

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-items/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve details of a specific work item.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="pk" type="string" :required="true">

Pk.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Query Parameters

<div class="params-list">

<ApiParam name="expand" type="string" :required="false">

Comma-separated list of related fields to expand in response

</ApiParam>

<ApiParam name="external_id" type="string" :required="false">

External system identifier for filtering or lookup

</ApiParam>

<ApiParam name="external_source" type="string" :required="false">

External system source name for filtering or lookup

</ApiParam>

<ApiParam name="fields" type="string" :required="false">

Comma-separated list of fields to include in response

</ApiParam>

<ApiParam name="order_by" type="string" :required="false">

Field to order results by. Prefix with '-' for descending order

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Retrieve a work item by ID" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/?expand=assignees&external_id=1234567890" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/?expand=assignees&external_id=1234567890",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/?expand=assignees&external_id=1234567890",
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
  "name": "Example Name",
  "description": "Example description",
  "sequence_id": 1,
  "priority": "high",
  "assignees": ["550e8400-e29b-41d4-a716-446655440000"],
  "labels": ["550e8400-e29b-41d4-a716-446655440000"],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>

</div>
