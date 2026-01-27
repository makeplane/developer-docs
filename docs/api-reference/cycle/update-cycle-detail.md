---
title: Update a cycle
description: Update a cycle via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, cycles, sprints, iterations
---


# Update a cycle

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing cycle by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

</ApiParam>

<ApiParam name="cycle_id" type="string" :required="true">

The unique identifier for the cycle.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string">

Name of the cycle.

</ApiParam>

<ApiParam name="description" type="string">

Description of the cycle.

</ApiParam>

<ApiParam name="start_date" type="string">

Start date of the cycle in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="end_date" type="string">

End date of the cycle in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="owned_by" type="string">

ID of the user who owns the cycle.

</ApiParam>

<ApiParam name="external_source" type="string">

External source identifier.

</ApiParam>

<ApiParam name="external_id" type="string">

External ID from the external source.

</ApiParam>

<ApiParam name="timezone" type="string">

Timezone for the cycle.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update a cycle" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/cycles/cycle-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description": "example-description",
  "start_date": "example-start_date",
  "end_date": "example-end_date",
  "owned_by": "example-owned_by",
  "external_source": "example-external_source",
  "external_id": "example-external_id",
  "timezone": "example-timezone"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/cycles/cycle-uuid/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description': 'example-description',
  'start_date': 'example-start_date',
  'end_date': 'example-end_date',
  'owned_by': 'example-owned_by',
  'external_source': 'example-external_source',
  'external_id': 'example-external_id',
  'timezone': 'example-timezone'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/cycles/cycle-uuid/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description": "example-description",
  "start_date": "example-start_date",
  "end_date": "example-end_date",
  "owned_by": "example-owned_by",
  "external_source": "example-external_source",
  "external_id": "example-external_id",
  "timezone": "example-timezone"
})
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

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
