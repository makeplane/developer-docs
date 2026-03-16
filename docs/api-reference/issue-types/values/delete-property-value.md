---
title: Delete property value
description: Delete property value via Plane API. HTTP request format, parameters, scopes, and example responses for delete property value.
keywords: plane, plane api, rest api, api integration, issue types, values, delete property value
---

# Delete property value

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/work-item-properties/{property_id}/values/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Delete the property value(s) for a work item. For multi-value properties, deletes all values.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="property_id" type="string" :required="true">

Property ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

<ApiParam name="work_item_id" type="string" :required="true">

Work item id.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_item_property_values:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Delete property value" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/work-item-properties/550e8400-e29b-41d4-a716-446655440001/values/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/work-item-properties/550e8400-e29b-41d4-a716-446655440001/values/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/work-item-properties/550e8400-e29b-41d4-a716-446655440001/values/",
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
