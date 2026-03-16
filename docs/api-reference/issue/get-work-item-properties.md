---
title: Get work item with properties
description: Get work item with properties via Plane API. HTTP request format, parameters, scopes, and example responses for get work item with properties.
keywords: plane, plane api, rest api, api integration, issue, get work item with properties
---

# Get work item with properties

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-items/{pk}/properties/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve a work item with all standard fields and custom properties.

Returns a consolidated response where:

- Standard fields use `_id` suffix (state_id, project_id, etc.)
- Custom properties are included as `custom_field_<name>` keys
- Each custom field contains: id, type, name, display_name, is_required, is_multi, value, value_detail

Custom properties are only included if the ISSUE_TYPES feature is enabled for the workspace.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="issue_id" type="string" :required="true">

Issue ID

</ApiParam>

<ApiParam name="pk" type="string" :required="true">

Pk.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Get work item with properties" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/properties/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/properties/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/properties/",
  {
    method: "GET",
    headers: {
      "X-API-Key": "your-api-key",
    },
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
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "sequence_id": 1,
  "description_html": "<p>Example content</p>",
  "description_stripped": "Example description",
  "state_id": "550e8400-e29b-41d4-a716-446655440000",
  "priority": "urgent",
  "workspace_id": "550e8400-e29b-41d4-a716-446655440000",
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "parent_id": "550e8400-e29b-41d4-a716-446655440000",
  "type_id": "550e8400-e29b-41d4-a716-446655440000",
  "estimate_point_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

</ResponsePanel>

</div>

</div>
