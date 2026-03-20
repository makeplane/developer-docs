---
title: Delete project label
description: Delete project label via Plane API. HTTP request format, parameters, scopes, and example responses for delete project label.
keywords: plane, plane api, rest api, api integration, project labels, delete project label
---

# Delete project label

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/project-labels/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Permanently delete an existing project label from the workspace.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="pk" type="string" :required="true">

Project Label ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.labels:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Delete project label" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/project-labels/550e8400-e29b-41d4-a716-446655440000/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/project-labels/550e8400-e29b-41d4-a716-446655440000/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/project-labels/550e8400-e29b-41d4-a716-446655440000/",
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
