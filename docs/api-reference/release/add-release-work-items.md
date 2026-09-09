---
title: Add work items to release
description: Add work items to release via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Add work items to release

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/work-items/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Adds one or more work items to a release. Work items already linked to the release are skipped. For a project-scoped release, every work item must belong to that project, otherwise the request fails with a 400 `RELEASE_WORK_ITEM_OUT_OF_SCOPE` error.

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

Array of work item IDs to add to the release.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.work_items:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Add work items to release" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "work_item_ids": ["d4e5f6a7-b8c9-0123-defa-456789012345", "e5f6a7b8-c9d0-1234-efab-567890123456"]
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'work_item_ids': ['d4e5f6a7-b8c9-0123-defa-456789012345', 'e5f6a7b8-c9d0-1234-efab-567890123456']
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/work-items/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      work_item_ids: ["d4e5f6a7-b8c9-0123-defa-456789012345", "e5f6a7b8-c9d0-1234-efab-567890123456"],
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
  "message": "Work items added successfully"
}
```

</ResponsePanel>

</div>
</div>
