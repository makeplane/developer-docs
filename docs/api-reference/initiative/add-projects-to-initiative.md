---
title: Add projects to initiative
description: Add projects to initiative via Plane API. HTTP request format, parameters, scopes, and example responses for add projects to initiative.
keywords: plane, plane api, rest api, api integration, initiative, add projects to initiative
---

# Add projects to initiative

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{slug}/initiatives/{initiative_id}/projects/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Add projects to an initiative by its ID

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="initiative_id" type="string" :required="true">

Initiative ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="project_ids" type="array" :required="false">

Project ids.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`initiatives.projects:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Add projects to initiative" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440001/projects/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "project_ids": [
    "550e8400-e29b-41d4-a716-446655440000"
  ]
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440001/projects/",
    headers={"X-API-Key": "your-api-key"},
    json={
      "project_ids": [
"550e8400-e29b-41d4-a716-446655440000"
      ]
    }
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440001/projects/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_ids: ["550e8400-e29b-41d4-a716-446655440000"],
    }),
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
  "identifier": "PROJ-123",
  "network": 2,
  "project_lead": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>

</div>
