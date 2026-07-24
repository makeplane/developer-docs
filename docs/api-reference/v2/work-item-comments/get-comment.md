---
title: Get a comment
description: Retrieve a single comment on a Plane work item with the v2 REST API. Path parameters, OAuth scopes, error codes, and code examples.
keywords: plane api v2, get work item comment, GET comment, comment by id, comment_html
---

# Get a comment

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v2/workspaces/{slug}/projects/{project_id}/work-items/{work_item_id}/comments/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve one comment by id. Use it to re-read a comment you created or updated, or to check `edited_at` before
overwriting a body you did not write.

The comment is looked up **within the work item in the path**. A comment id that belongs to a different work
item is not reachable here and returns `404 resource_not_found`, the same as an id that does not exist.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is
`my-team`.

</ApiParam>

<ApiParam name="project_id" type="string (uuid)" :required="true">

The project the work item belongs to.

</ApiParam>

<ApiParam name="work_item_id" type="string (uuid)" :required="true">

The work item the comment is attached to.

</ApiParam>

<ApiParam name="pk" type="string (uuid)" :required="true">

The comment to retrieve.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items.comments:read`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                                          |
| ------ | -------------------- | ------------------------------------------------------------------------------ |
| `401`  | `unauthorized`       | Missing or invalid credentials.                                                |
| `403`  | `forbidden`          | Your role or token scope can't read this work item.                            |
| `404`  | `resource_not_found` | No such comment, it belongs to another work item, or it's outside your tenant. |
| `429`  | `rate_limited`       | Throttled. Honor the `Retry-After` header before retrying.                     |

</div>

</div>

<div class="api-right">

<CodePanel title="Get a comment" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/work-items/8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13/comments/c1f7a3d9-2b64-4f80-9c1a-3d5e8b2a6c47/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/work-items/8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13/comments/c1f7a3d9-2b64-4f80-9c1a-3d5e8b2a6c47/",
    headers={"X-Api-Key": "your-api-key"},
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/work-items/8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13/comments/c1f7a3d9-2b64-4f80-9c1a-3d5e8b2a6c47/",
  {
    headers: {
      "X-Api-Key": "your-api-key",
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
  "id": "c1f7a3d9-2b64-4f80-9c1a-3d5e8b2a6c47",
  "work_item_id": "8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13",
  "comment_html": "<p>Deployed the fix to staging. Please re-test.</p>",
  "comment_stripped": "Deployed the fix to staging. Please re-test.",
  "access": "INTERNAL",
  "actor_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "external_id": null,
  "external_source": null,
  "edited_at": null,
  "created_at": "2026-01-14T09:22:41.478363Z",
  "created_by_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430"
}
```

</ResponsePanel>

<ResponsePanel status="404">

```json
{
  "type": "https://api.plane.so/errors/resource_not_found",
  "title": "Resource Not Found",
  "status": 404,
  "code": "resource_not_found",
  "detail": "No comment matches the given query."
}
```

</ResponsePanel>

</div>
</div>
