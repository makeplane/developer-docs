---
title: Delete a release label
description: Permanently delete a release label via Plane API. Removes the label from the workspace catalog. Returns 204 on success.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Delete a release label

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/labels/{label_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Permanently deletes a release label from the workspace label catalog. This action cannot be undone.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="label_id" type="string" :required="true">

The unique identifier for the release label.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.labels:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Delete a release label" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/labels/f6a7b8c9-d0e1-2345-fabc-678901234567/",
  {
    method: "DELETE",
    headers: {
      "X-API-Key": "your-api-key",
    },
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
