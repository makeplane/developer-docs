---
title: Retrieve a release tag
description: Get retrieve a release tag details via Plane API. Retrieve complete information for a specific resource.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Retrieve a release tag

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/tags/{tag_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieves the details of an existing release tag by its ID.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="tag_id" type="string" :required="true">

The unique identifier for the release tag.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.tags:read`

</div>

</div>
<div class="api-right">

<CodePanel title="Retrieve a release tag" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/", {
  method: "GET",
  headers: {
    "X-API-Key": "your-api-key",
  },
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
  "created_at": "2025-03-01T10:00:00.000000Z",
  "updated_at": "2025-03-05T14:30:00.000000Z",
  "deleted_at": null,
  "version": "2.4.0",
  "description": "Spring release tag",
  "commit_hash": "9fceb02d0ae598e95dc970b74767f19372d61af8",
  "git_tag": "v2.4.0",
  "created_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "updated_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "project": null
}
```

</ResponsePanel>

</div>
</div>
