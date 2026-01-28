---
title: Add projects to teamspace
description: Create projects to teamspace via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, projects, project management
---


# Add projects to teamspace

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/teamspaces/{teamspace_id}/projects/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Adds projects to a teamspace

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">



</ApiParam>

<ApiParam name="teamspace_id" type="string" :required="true">



</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="project_ids" type="string[]" :required="true">

Array of project IDs to add to the teamspace

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Add projects to teamspace" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/projects/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "project_ids": "example-project_ids"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/projects/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'project_ids': 'example-project_ids'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/projects/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "project_ids": "example-project_ids"
})
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "project-uuid",
  "name": "Project Name",
  "identifier": "PROJ",
  "description": "Project description",
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
