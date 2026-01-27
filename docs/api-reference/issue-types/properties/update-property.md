---
title: Update a custom property
description: Update a custom property via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks
---


# Update a custom property

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-item-types/{type_id}/work-item-properties/{property_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing custom property by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

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

<ApiParam name="property_id" type="string" :required="true">

The unique identifier for the custom property.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="display_name" type="string" :required="true">

Display name shown in the UI.

</ApiParam>

<ApiParam name="description" type="string">

Description of the custom property.

</ApiParam>

<ApiParam name="default_value" type="string[]">

Default value(s) for the property.

</ApiParam>

<ApiParam name="validation_rules" type="object">

Validation rules applied to property values.

</ApiParam>

<ApiParam name="is_required" type="boolean">

Whether this property is required when creating work items.

</ApiParam>

<ApiParam name="is_active" type="boolean">

Whether this property is currently active.

</ApiParam>

<ApiParam name="is_multi" type="boolean">

Whether this property allows multiple values.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update a custom property" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/work-item-properties/{property_id}/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "display_name": "example-display_name",
  "description": "example-description",
  "default_value": "example-default_value",
  "validation_rules": "example-validation_rules",
  "is_required": true,
  "is_active": true,
  "is_multi": true
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/work-item-properties/{property_id}/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'display_name': 'example-display_name',
  'description': 'example-description',
  'default_value': 'example-default_value',
  'validation_rules': 'example-validation_rules',
  'is_required': true,
  'is_active': true,
  'is_multi': true
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/work-item-properties/{property_id}/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "display_name": "example-display_name",
  "description": "example-description",
  "default_value": "example-default_value",
  "validation_rules": "example-validation_rules",
  "is_required": true,
  "is_active": true,
  "is_multi": true
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
