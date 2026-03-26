---
title: Update a work item comment
description: Update a work item comment via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks, comments, discussion, collaboration
---

# Update a work item comment

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/comments/{comment_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing work item comment by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

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

<ApiParam name="comment_id" type="string" :required="true">

The unique identifier for the comment.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="comment_json" type="object" :required="false">

Comment json.

</ApiParam>

<ApiParam name="comment_html" type="string" :required="false">

Comment html.

</ApiParam>

<ApiParam name="access" type="string" :required="false">

* `INTERNAL` - INTERNAL
* `EXTERNAL` - EXTERNAL

</ApiParam>

<ApiParam name="external_source" type="string" :required="false">

External source.

</ApiParam>

<ApiParam name="external_id" type="string" :required="false">

External id.

</ApiParam>

<ApiParam name="parent" type="string" :required="false">

Parent.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items.comments:write`

</div>


</div>

<div class="api-right">

<CodePanel title="Update a work item comment" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/comments/comment-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "comment_html": "<p>Example content</p>",
  "external_id": "550e8400-e29b-41d4-a716-446655440000",
  "external_source": "github"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/comments/comment-uuid/",
    headers={"X-API-Key": "your-api-key"},
    json={
      "comment_html": "<p>Example content</p>",
      "external_id": "550e8400-e29b-41d4-a716-446655440000",
      "external_source": "github"
    }
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/comments/comment-uuid/", {
  method: "PATCH",
  headers: {
    "X-API-Key": "your-api-key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
  "comment_html": "<p>Example content</p>",
  "external_id": "550e8400-e29b-41d4-a716-446655440000",
  "external_source": "github"
}),
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "comment_html": "<p>Example content</p>",
  "comment_json": {
    "type": "doc",
    "content": [
      {
"type": "paragraph",
"content": [
  {
    "type": "text",
    "text": "This issue has been resolved by implementing OAuth 2.0 flow."
  }
]
      }
    ]
  },
  "actor": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "John",
    "last_name": "Doe",
    "display_name": "Example Name",
    "avatar": "https://example.com/assets/example-image.png"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>

</div>
