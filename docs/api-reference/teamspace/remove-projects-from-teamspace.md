---
title: Remove projects from teamspace
description: Remove projects from teamspace via Plane API. HTTP request format, parameters, scopes, and example responses for remove projects from teamspace.
keywords: plane, plane api, rest api, api integration, teamspace, remove projects from teamspace
---

# Remove projects from teamspace

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/teamspaces/{teamspace_id}/projects/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Remove projects from a teamspace by its ID

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

<ApiParam name="teamspace_id" type="string" :required="true">

Teamspace ID

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`teamspaces.projects:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Remove projects from teamspace" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/550e8400-e29b-41d4-a716-446655440001/projects/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/550e8400-e29b-41d4-a716-446655440001/projects/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/550e8400-e29b-41d4-a716-446655440001/projects/",
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
