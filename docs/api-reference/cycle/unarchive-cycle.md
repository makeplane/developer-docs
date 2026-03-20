---
title: Restore a cycle
description: Restore a cycle via Plane API. HTTP request format, parameters, scopes, and example responses for restore a cycle.
keywords: plane, plane api, rest api, api integration, cycle, restore a cycle
---

# Restore a cycle

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/archived-cycles/{cycle_id}/unarchive/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Restore an archived cycle to active status, making it available for regular use.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="cycle_id" type="string" :required="true">

Cycle id.

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

`projects.cycles:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Restore a cycle" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/archived-cycles/550e8400-e29b-41d4-a716-446655440001/unarchive/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/archived-cycles/550e8400-e29b-41d4-a716-446655440001/unarchive/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/archived-cycles/550e8400-e29b-41d4-a716-446655440001/unarchive/",
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
