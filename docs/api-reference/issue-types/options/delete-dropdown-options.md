---
title: Delete dropdown options
description: Delete dropdown options via Plane API. HTTP request format, parameters, scopes, and example responses for delete dropdown options.
keywords: plane, plane api, rest api, api integration, issue types, options, delete dropdown options
---

# Delete dropdown options

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-item-properties/{property_id}/options/{option_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Delete an issue property option

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

`projects.work_item_property_options:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Delete dropdown options" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-properties/550e8400-e29b-41d4-a716-446655440001/options/550e8400-e29b-41d4-a716-446655440002/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-properties/550e8400-e29b-41d4-a716-446655440001/options/550e8400-e29b-41d4-a716-446655440002/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-item-properties/550e8400-e29b-41d4-a716-446655440001/options/550e8400-e29b-41d4-a716-446655440002/",
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
