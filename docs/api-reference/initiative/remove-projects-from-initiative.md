---
title: Remove projects from initiative
description: Remove projects from initiative via Plane API. HTTP request format, parameters, scopes, and example responses for remove projects from initiative.
keywords: plane, plane api, rest api, api integration, initiative, remove projects from initiative
---

# Remove projects from initiative

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/initiatives/{initiative_id}/projects/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Remove projects from an initiative by its ID

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="initiative_id" type="string" :required="true">

Initiative ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`initiatives.projects:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Remove projects from initiative" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440001/projects/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440001/projects/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440001/projects/",
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
