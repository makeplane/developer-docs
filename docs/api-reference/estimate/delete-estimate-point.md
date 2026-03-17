---
title: Delete an estimate point
description: Delete an estimate point via Plane API. HTTP request format, parameters, scopes, and example responses for delete an estimate point.
keywords: plane, plane api, rest api, api integration, estimate points, delete an estimate point
---

# Delete an estimate point

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/estimates/{estimate_id}/estimate-points/{estimate_point_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Delete a single estimate point from a project estimate.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="estimate_point_id" type="string" :required="true">

Estimate point ID

</ApiParam>

<ApiParam name="estimate_id" type="string" :required="true">

Estimate ID

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

`projects.estimates:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Delete an estimate point" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/estimates/550e8400-e29b-41d4-a716-446655440000/estimate-points/550e8400-e29b-41d4-a716-446655440010/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/estimates/550e8400-e29b-41d4-a716-446655440000/estimate-points/550e8400-e29b-41d4-a716-446655440010/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/estimates/550e8400-e29b-41d4-a716-446655440000/estimate-points/550e8400-e29b-41d4-a716-446655440010/",
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
