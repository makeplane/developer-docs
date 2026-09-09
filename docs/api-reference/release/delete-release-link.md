---
title: Delete a release link
description: Permanently delete a release link via Plane API. Removes the link. Returns 204 on success.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Delete a release link

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/links/{link_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Permanently deletes a link from a release. This action cannot be undone.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="release_id" type="string" :required="true">

The unique identifier for the release.

</ApiParam>

<ApiParam name="link_id" type="string" :required="true">

The unique identifier for the link.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.links:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Delete a release link" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/links/b2c3d4e5-f6a7-8901-bcde-f23456789012/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/links/b2c3d4e5-f6a7-8901-bcde-f23456789012/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/links/b2c3d4e5-f6a7-8901-bcde-f23456789012/",
  {
    method: "DELETE",
    headers: {
      "X-API-Key": "your-api-key",
    },
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
