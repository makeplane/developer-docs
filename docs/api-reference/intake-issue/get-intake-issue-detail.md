---
title: Retrieve an intake work item
description: Retrieve an intake work item via Plane API. HTTP request format, parameters, scopes, and example responses for retrieve an intake work item.
keywords: plane, plane api, rest api, api integration, intake issue, retrieve an intake work item
---

# Retrieve an intake work item

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/intake-issues/{issue_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve details of a specific intake work item.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="issue_id" type="string" :required="true">

Issue ID

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

### Scopes

`projects.intakes:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Retrieve an intake work item" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/intake-issues/550e8400-e29b-41d4-a716-446655440001/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/intake-issues/550e8400-e29b-41d4-a716-446655440001/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/intake-issues/550e8400-e29b-41d4-a716-446655440001/",
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
  "status": 0,
  "source": "in_app",
  "issue": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Example Name",
    "description": "Example description",
    "priority": "medium",
    "sequence_id": 124
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>

</div>
