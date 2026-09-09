---
title: Delete a release tag
description: Permanently delete a release tag via Plane API. Removes the release tag. Returns 204 on success.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Delete a release tag

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/tags/{tag_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Permanently deletes a release tag from a workspace. This action cannot be undone.

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

`releases.tags:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Delete a release tag" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/", {
  method: "DELETE",
  headers: {
    "X-API-Key": "your-api-key",
  },
});
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
