---
title: Add custom property values
description: Create custom property values via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks
---


# Add custom property values

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/work-item-properties/{property_id}/values/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Allows you to specify the values for a custom property.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

</ApiParam>

<ApiParam name="work_item_id" type="string" :required="true">

The unique identifier for the work item.

</ApiParam>

<ApiParam name="property_id" type="string" :required="true">

The unique identifier for the custom property.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="value" type="string | boolean | number | string[]" :required="true">

The value type depends on the property type:
- TEXT/URL/EMAIL/FILE: string
- DATETIME: string (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
- DECIMAL: number (int or float)
- BOOLEAN: boolean (true/false)
- OPTION/RELATION (single): string (UUID)
- OPTION/RELATION (multi, when is_multi=True): list of strings (UUIDs) or single string

For multi-value properties (is_multi=True):
- Accept either a single UUID string or a list of UUID strings
- Multiple records are created
- Response will be a list of values

For single-value properties:
- Only one value is allowed per work item/property combination

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Add custom property values" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/work-item-properties/{property_id}/values/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "value": "example-value"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/work-item-properties/{property_id}/values/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'value': 'example-value'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/work-item-properties/{property_id}/values/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "value": "example-value"
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
