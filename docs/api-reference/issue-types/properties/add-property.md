---
title: Create a custom property
description: Create a custom property via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks
---


# Create a custom property

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-item-types/{type_id}/work-item-properties/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new custom property for a work item type.

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

<ApiParam name="options" type="object[]">

Array of option objects for OPTION type properties. This field can be used while creating a property with type OPTION to set options on the custom property during creation itself. Each option object can contain:
- `name` (string): Name of the option
- `description` (string): Description of the option
- `is_active` (boolean): Whether the option is active
- `sort_order` (number): Sort order for the option
- `parent` (string): Parent option ID for hierarchical options
- `is_default` (boolean): Whether this is the default option
- `logo_props` (object): Logo properties for the option

To add or update options on an OPTION property after creation, you can use the APIs from [`issue-types/options/add-dropdown-options`](/api-reference/issue-types/options/add-dropdown-options).

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Create a custom property" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/work-item-properties/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "display_name": "example-display_name",
  "description": "example-description",
  "default_value": "example-default_value",
  "validation_rules": "example-validation_rules",
  "is_required": true,
  "is_active": true,
  "is_multi": true,
  "options": "example-options"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/work-item-properties/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'display_name': 'example-display_name',
  'description': 'example-description',
  'default_value': 'example-default_value',
  'validation_rules': 'example-validation_rules',
  'is_required': true,
  'is_active': true,
  'is_multi': true,
  'options': 'example-options'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-item-types/{type_id}/work-item-properties/",
  {
    method: "POST",
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
  "is_multi": true,
  "options": "example-options"
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
