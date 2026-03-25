---
title: Retrieve option details
description: Retrieve option details via Plane API. HTTP request format, parameters, scopes, and example responses for retrieve option details.
keywords: plane, plane api, rest api, api integration, issue types, options, retrieve option details
---

# Retrieve option details

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-item-properties/{property_id}/options/{option_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Get issue property option by id

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="option_id" type="string" :required="true">

Option id.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="property_id" type="string" :required="true">

Property ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_item_property_options:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Retrieve option details" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-properties/550e8400-e29b-41d4-a716-446655440001/options/550e8400-e29b-41d4-a716-446655440002/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-properties/550e8400-e29b-41d4-a716-446655440001/options/550e8400-e29b-41d4-a716-446655440002/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-properties/550e8400-e29b-41d4-a716-446655440001/options/550e8400-e29b-41d4-a716-446655440002/",
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
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "name": "Example Name",
  "description": "Example description",
  "deleted_at": "2024-01-01T00:00:00Z",
  "sort_order": 1,
  "logo_props": "example-value",
  "is_active": true,
  "is_default": true,
  "external_source": "github",
  "external_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

</ResponsePanel>

</div>

</div>
