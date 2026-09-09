---
title: Update a release comment
description: Update a release comment via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Update a release comment

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/comments/{comment_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing release comment by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="release_id" type="string" :required="true">

The unique identifier for the release.

</ApiParam>

<ApiParam name="comment_id" type="string" :required="true">

The unique identifier for the comment.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="comment_html" type="string">

HTML-formatted content of the comment.

</ApiParam>

<ApiParam name="parent" type="string">

ID of the parent comment, for threaded replies.

</ApiParam>

<ApiParam name="is_resolved" type="boolean">

Whether the comment has been resolved.

</ApiParam>

<ApiParam name="edited_at" type="string">

Timestamp when the comment was last edited, in ISO 8601 format.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.comments:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Update a release comment" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/comments/c0ffee00-1111-2222-3333-444444444444/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "comment_html": "<p>QA sign-off complete. Retested after hotfix.</p>",
  "is_resolved": true,
  "edited_at": "2025-03-02T10:05:00.000000Z"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/comments/c0ffee00-1111-2222-3333-444444444444/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'comment_html': '<p>QA sign-off complete. Retested after hotfix.</p>',
  'is_resolved': True,
  'edited_at': '2025-03-02T10:05:00.000000Z'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/comments/c0ffee00-1111-2222-3333-444444444444/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment_html: "<p>QA sign-off complete. Retested after hotfix.</p>",
      is_resolved: true,
      edited_at: "2025-03-02T10:05:00.000000Z",
    }),
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "c0ffee00-1111-2222-3333-444444444444",
  "created_at": "2025-03-02T09:15:00.000000Z",
  "updated_at": "2025-03-02T10:05:00.000000Z",
  "deleted_at": null,
  "comment": {
    "description_html": "<p>QA sign-off complete. Retested after hotfix.</p>",
    "description_binary": null,
    "description_stripped": "QA sign-off complete. Retested after hotfix.",
    "description_json": {}
  },
  "is_hidden": false,
  "edited_at": "2025-03-02T10:05:00.000000Z",
  "is_resolved": true,
  "created_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "updated_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "release": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "parent": null
}
```

</ResponsePanel>

</div>
</div>
