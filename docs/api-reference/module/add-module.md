---
title: Create a module
description: Create a module via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, modules, features
---


# Create a module

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/modules/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new module in a project.

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

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Name of the module.

</ApiParam>

<ApiParam name="description" type="string">

Description of the module.

</ApiParam>

<ApiParam name="start_date" type="string">

Start date of the module in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="target_date" type="string">

Target date of the module in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="status" type="string">

Status of the module. Possible values: `backlog`, `planned`, `in-progress`, `paused`, `completed`, `cancelled`.

</ApiParam>

<ApiParam name="lead" type="string">

ID of the user who leads the module.

</ApiParam>

<ApiParam name="members" type="string[]">

Array of member user IDs to assign to the module.

</ApiParam>

<ApiParam name="external_source" type="string">

External source identifier.

</ApiParam>

<ApiParam name="external_id" type="string">

External ID from the external source.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Create a module" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/modules/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description": "example-description",
  "start_date": "example-start_date",
  "target_date": "example-target_date",
  "status": "example-status",
  "lead": "example-lead",
  "members": "example-members",
  "external_source": "example-external_source",
  "external_id": "example-external_id"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/modules/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description': 'example-description',
  'start_date': 'example-start_date',
  'target_date': 'example-target_date',
  'status': 'example-status',
  'lead': 'example-lead',
  'members': 'example-members',
  'external_source': 'example-external_source',
  'external_id': 'example-external_id'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/modules/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description": "example-description",
  "start_date": "example-start_date",
  "target_date": "example-target_date",
  "status": "example-status",
  "lead": "example-lead",
  "members": "example-members",
  "external_source": "example-external_source",
  "external_id": "example-external_id"
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
