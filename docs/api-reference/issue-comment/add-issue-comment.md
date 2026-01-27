---
title: Create a work item comment
description: Create a work item comment via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks, comments, discussion, collaboration
---


# Create a work item comment

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/comments/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new comment on a work item.

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

<ApiParam name="comment_html" type="string">

HTML-formatted version of the comment.

</ApiParam>

<ApiParam name="comment_json" type="object">

JSON representation of the comment structure.

</ApiParam>

<ApiParam name="access" type="string">

Visibility level of the comment. Possible values: `INTERNAL`, `EXTERNAL`.

</ApiParam>

<ApiParam name="external_source" type="string">

Identifier for the external source.

</ApiParam>

<ApiParam name="external_id" type="string">

ID from the external source.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Create a work item comment" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/comments/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "comment_html": "example-comment_html",
  "comment_json": "example-comment_json",
  "access": "example-access",
  "external_source": "example-external_source",
  "external_id": "example-external_id"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/comments/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'comment_html': 'example-comment_html',
  'comment_json': 'example-comment_json',
  'access': 'example-access',
  'external_source': 'example-external_source',
  'external_id': 'example-external_id'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/comments/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "comment_html": "example-comment_html",
  "comment_json": "example-comment_json",
  "access": "example-access",
  "external_source": "example-external_source",
  "external_id": "example-external_id"
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
