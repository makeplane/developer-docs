---
title: Update a work item type
description: Update a work item type via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks
---


# Update a work item type

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-item-types/{type_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing work item type by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

</ApiParam>

<ApiParam name="type_id" type="string" :required="true">

The unique identifier for the work item type.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string">

Name of the work item type

</ApiParam>

<ApiParam name="description" type="string">

Description of the work item type.

</ApiParam>

<ApiParam name="logo_props" type="object">

Logo properties for the work item type.

</ApiParam>

<ApiParam name="is_epic" type="boolean">

Whether this work item type is an epic.

</ApiParam>

<ApiParam name="is_default" type="boolean">

Whether this is the default work item type.

</ApiParam>

<ApiParam name="is_active" type="boolean">

Whether this work item type is active.

</ApiParam>

<ApiParam name="level" type="number">

Hierarchical level of the work item type.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update a work item type" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description": "example-description",
  "logo_props": "example-logo_props",
  "is_epic": true,
  "is_default": true,
  "is_active": true,
  "level": 1
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description': 'example-description',
  'logo_props': 'example-logo_props',
  'is_epic': true,
  'is_default': true,
  'is_active': true,
  'level': 1
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description": "example-description",
  "logo_props": "example-logo_props",
  "is_epic": true,
  "is_default": true,
  "is_active": true,
  "level": 1
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
