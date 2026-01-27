---
title: Delete a teamspace
description: Delete a teamspace via Plane API. HTTP DELETE request for removing resources.
keywords: plane, plane api, rest api, api integration
---


# Delete a teamspace

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/teamspaces/{teamspace_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Deletes a teamspace

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="teamspace_id" type="string" :required="true">

The unique identifier for the teamspace.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Delete a teamspace" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/",
  {
    method: "DELETE",
    headers: {
      "X-API-Key": "your-api-key"
    }
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="204">

```json
// 204 No Content
```

</ResponsePanel>

</div>
</div>
