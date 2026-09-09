---
title: Remove labels from release
description: Delete labels from release via Plane API. HTTP DELETE request for removing resources.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Remove labels from release

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/labels/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Removes one or more labels from a release.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="release_id" type="string" :required="true">

The unique identifier for the release.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="label_ids" type="string[]" :required="true">

Array of release label IDs to remove from the release.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Remove labels from release" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "label_ids": ["f6a7b8c9-d0e1-2345-fabc-678901234567"]
}'
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'label_ids': ['f6a7b8c9-d0e1-2345-fabc-678901234567']
}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/labels/",
  {
    method: "DELETE",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      label_ids: ["f6a7b8c9-d0e1-2345-fabc-678901234567"],
    }),
  }
);
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
