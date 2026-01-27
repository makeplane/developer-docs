---
title: Add work items to cycle
description: Create work items to cycle via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks, cycles, sprints, iterations
---


# Add work items to cycle

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/cycle-issues/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Adds work items (issues) to a cycle

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

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="issues" type="string[]" :required="true">

Array of work item IDs to add to the cycle.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Add work items to cycle" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/cycles/cycle-uuid/cycle-issues/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "issues": "example-issues"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/cycles/cycle-uuid/cycle-issues/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'issues': 'example-issues'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/cycles/cycle-uuid/cycle-issues/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "issues": "example-issues"
})
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "project-uuid",
  "name": "Project Name",
  "identifier": "PROJ",
  "description": "Project description",
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
