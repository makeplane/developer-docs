---
title: Delete a workspace page
description: Delete an archived workspace page via the Plane API.
keywords: plane, plane api, workspace page, delete wiki page
---

# Delete a workspace page

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Delete a workspace page. Archive the page before calling this operation; deleting an active page returns `400`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace's unique slug.

</ApiParam>
<ApiParam name="page_id" type="string" :required="true">

The page UUID.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Delete a workspace page" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/" -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests
response = requests.delete("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/", headers={"X-API-Key": "your-api-key"})
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/", {
  method: "DELETE",
  headers: { "X-API-Key": "your-api-key" },
});
```

</template>
</CodePanel>
<ResponsePanel status="204">

No response body.

</ResponsePanel>

</div>

</div>
