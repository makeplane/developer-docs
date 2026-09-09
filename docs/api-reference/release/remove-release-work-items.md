---
title: Remove work items from release
description: Remove work items from release via Plane API. HTTP DELETE request for removing resources.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Remove work items from release

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/work-items/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Removes one or more work items from a release.

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

<ApiParam name="work_item_ids" type="string[]" :required="true">

Array of work item IDs to remove from the release.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.work_items:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Remove work items from release" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "work_item_ids": ["d4e5f6a7-b8c9-0123-defa-456789012345"]
}'
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'work_item_ids': ['d4e5f6a7-b8c9-0123-defa-456789012345']
}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/",
  {
    method: "DELETE",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      work_item_ids: ["d4e5f6a7-b8c9-0123-defa-456789012345"],
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
