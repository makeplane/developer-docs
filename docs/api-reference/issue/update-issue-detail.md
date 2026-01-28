---
title: Update a work item
description: Update a work item via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks
---


# Update a work item

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing work item by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

</ApiParam>

<ApiParam name="work_item_id" type="string" :required="true">

The unique identifier for the work item.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string">

Name of the work item.

</ApiParam>

<ApiParam name="description_html" type="string">

HTML-formatted description of the work item.

</ApiParam>

<ApiParam name="state" type="string">

ID of the state for the work item.

</ApiParam>

<ApiParam name="priority" type="string">

Priority level. Possible values: `none`, `urgent`, `high`, `medium`, `low`.

</ApiParam>

<ApiParam name="assignees" type="string[]">

Array of user IDs to assign to the work item.

</ApiParam>

<ApiParam name="labels" type="string[]">

Array of label IDs to apply to the work item.

</ApiParam>

<ApiParam name="parent" type="string">

ID of the parent work item.

</ApiParam>

<ApiParam name="estimate_point" type="string">

Estimate points for the work item (0-7).

</ApiParam>

<ApiParam name="type" type="string">

ID of the work item type.

</ApiParam>

<ApiParam name="module" type="string">

ID of the module the work item belongs to.

</ApiParam>

<ApiParam name="start_date" type="string">

Start date in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="target_date" type="string">

Target completion date in YYYY-MM-DD format.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update a work item" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description_html": "example-description_html",
  "state": "example-state",
  "priority": "example-priority",
  "assignees": "example-assignees",
  "labels": "example-labels",
  "parent": "example-parent",
  "estimate_point": "example-estimate_point",
  "type": "example-type",
  "module": "example-module",
  "start_date": "example-start_date",
  "target_date": "example-target_date"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description_html': 'example-description_html',
  'state': 'example-state',
  'priority': 'example-priority',
  'assignees': 'example-assignees',
  'labels': 'example-labels',
  'parent': 'example-parent',
  'estimate_point': 'example-estimate_point',
  'type': 'example-type',
  'module': 'example-module',
  'start_date': 'example-start_date',
  'target_date': 'example-target_date'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description_html": "example-description_html",
  "state": "example-state",
  "priority": "example-priority",
  "assignees": "example-assignees",
  "labels": "example-labels",
  "parent": "example-parent",
  "estimate_point": "example-estimate_point",
  "type": "example-type",
  "module": "example-module",
  "start_date": "example-start_date",
  "target_date": "example-target_date"
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
