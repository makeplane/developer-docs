---
title: Delete a custom property
description: Delete a custom property via Plane API. HTTP request format, parameters, scopes, and example responses for delete a custom property.
keywords: plane, plane api, rest api, api integration, issue types, properties, delete a custom property
---

# Delete a custom property

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-item-types/{type_id}/work-item-properties/{property_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Delete an issue property

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="property_id" type="string" :required="true">

Property id.

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

<ApiParam name="type_id" type="string" :required="true">

Type ID

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_item_properties:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Delete a custom property" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/550e8400-e29b-41d4-a716-446655440001/work-item-properties/550e8400-e29b-41d4-a716-446655440001/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/550e8400-e29b-41d4-a716-446655440001/work-item-properties/550e8400-e29b-41d4-a716-446655440001/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-types/550e8400-e29b-41d4-a716-446655440001/work-item-properties/550e8400-e29b-41d4-a716-446655440001/",
  {
    method: "DELETE",
    headers: {
      "X-API-Key": "your-api-key",
    },
  }
);
console.log(response.status);
```

</template>
</CodePanel>

<ResponsePanel status="204">

No response body.

</ResponsePanel>

</div>

</div>
