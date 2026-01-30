---
title: Delete an intake work item
description: Delete an intake work item via Plane API. HTTP DELETE request for removing resources.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks, intake, triage, submissions
---


# Delete an intake work item

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/intake-issues/{issue_id}</span>
</div>

<div class="api-two-column">
<div class="api-left">

Permanently deletes an intake work item from a project. This action cannot be undone.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project

</ApiParam>

<ApiParam name="work_item_id" type="string" :required="true">

The unique identifier of the work item

</ApiParam>

<ApiParam name="intake_id" type="string" :required="true">

The unique identifier for the intake work item.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Delete an intake work item" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/intake-issues/issue-uuid" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/intake-issues/issue-uuid",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/intake-issues/issue-uuid",
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
