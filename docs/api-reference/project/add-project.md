---
title: Create a project
description: Create a project via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, projects, project management
---


# Create a project

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new project in a workspace.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Name of the project.

</ApiParam>

<ApiParam name="identifier" type="string" :required="true">

Short identifier used in work item IDs.

</ApiParam>

<ApiParam name="description" type="string">

Description of the project.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Create a project" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "identifier": "example-identifier",
  "description": "example-description"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'identifier': 'example-identifier',
  'description': 'example-description'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "identifier": "example-identifier",
  "description": "example-description"
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
