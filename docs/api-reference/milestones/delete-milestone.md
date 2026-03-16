---
title: Delete milestone
description: Delete milestone via Plane API. HTTP request format, parameters, scopes, and example responses for delete milestone.
keywords: plane, plane api, rest api, api integration, milestones, delete milestone
---

# Delete milestone

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/milestones/{milestone_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Delete a specific milestone by its ID.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="milestone_id" type="string" :required="true">

Milestone id.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

Project id.

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Slug.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

API key authentication or an OAuth token with equivalent access.

</div>

</div>

<div class="api-right">

<CodePanel title="Delete milestone" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/milestones/550e8400-e29b-41d4-a716-446655440001/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/milestones/550e8400-e29b-41d4-a716-446655440001/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/milestones/550e8400-e29b-41d4-a716-446655440001/",
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
