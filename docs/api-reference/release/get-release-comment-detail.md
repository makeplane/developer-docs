---
title: Retrieve a release comment
description: Get retrieve a release comment details via Plane API. Retrieve complete information for a specific resource.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Retrieve a release comment

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/comments/{comment_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieves the details of an existing release comment by its ID.

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

### Scopes

`releases.comments:read`

</div>

</div>
<div class="api-right">

<CodePanel title="Retrieve a release comment" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/comments/c0ffee00-1111-2222-3333-444444444444/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/comments/c0ffee00-1111-2222-3333-444444444444/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/comments/c0ffee00-1111-2222-3333-444444444444/",
  {
    method: "GET",
    headers: {
      "X-API-Key": "your-api-key",
    },
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
  "updated_at": "2025-03-02T09:15:00.000000Z",
  "deleted_at": null,
  "comment": {
    "description_html": "<p>QA sign-off complete.</p>",
    "description_binary": null,
    "description_stripped": "QA sign-off complete.",
    "description_json": {}
  },
  "is_hidden": false,
  "edited_at": null,
  "is_resolved": false,
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
