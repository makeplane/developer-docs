---
title: Update dropdown options
description: Update dropdown options via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks
---


# Update dropdown options

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-item-properties/{property_id}/options/{option_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Lets you modify existing options within a dropdown property.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

</ApiParam>

<ApiParam name="property_id" type="string" :required="true">

The unique identifier for the custom property.

</ApiParam>

<ApiParam name="option_id" type="string" :required="true">

The unique identifier for the option.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Name of the option.

</ApiParam>

<ApiParam name="description" type="string">

Description of the option.

</ApiParam>

<ApiParam name="is_default" type="boolean">

Whether this is the default option for the property.

</ApiParam>

<ApiParam name="is_active" type="boolean">

Whether this option is currently active.

</ApiParam>

<ApiParam name="parent" type="string">



</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update dropdown options" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-properties/{property_id}/options/{option_id}/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description": "example-description",
  "is_default": true,
  "is_active": true,
  "parent": "example-parent"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-properties/{property_id}/options/{option_id}/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description': 'example-description',
  'is_default': true,
  'is_active': true,
  'parent': 'example-parent'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-properties/{property_id}/options/{option_id}/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description": "example-description",
  "is_default": true,
  "is_active": true,
  "parent": "example-parent"
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
