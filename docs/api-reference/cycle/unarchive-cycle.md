---
title: Restore a cycle
description: Restore a cycle API endpoint. Request format, parameters, and response examples for Plane REST API.
keywords: plane, plane api, rest api, api integration, cycles, sprints, iterations
---


# Restore a cycle

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/archived-cycles/{cycle_id}/unarchive/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Restores an archived cycle back to the active cycles list.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

</ApiParam>

<ApiParam name="cycle_id" type="string" :required="true">

The unique identifier for the cycle.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Restore a cycle" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/archived-cycles/cycle-uuid/unarchive/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/archived-cycles/cycle-uuid/unarchive/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/archived-cycles/cycle-uuid/unarchive/",
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
