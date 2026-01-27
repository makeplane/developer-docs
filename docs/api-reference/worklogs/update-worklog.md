---
title: Update a worklog
description: Update a worklog via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, time tracking, worklogs, time management
---


# Update a worklog

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/worklogs/{worklog_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Update an existing worklog entry. You can change the description or duration of the worklog.

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

<ApiParam name="worklog_id" type="string" :required="true">

The unique identifier of the worklog

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="description" type="string" :required="true">

Description of the work done during the worklog

</ApiParam>

<ApiParam name="duration" type="integer" :required="true">

Time spent on the issue in minutes

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update a worklog" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/worklogs/{worklog_id}/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "description": "example-description",
  "duration": 1
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/worklogs/{worklog_id}/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'description': 'example-description',
  'duration': 1
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/worklogs/{worklog_id}/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "description": "example-description",
  "duration": 1
})
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

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
