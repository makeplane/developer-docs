---
title: Restore a workspace page
description: Restore an archived workspace page via the Plane API.
keywords: plane, plane api, workspace page, restore wiki page, unarchive
---

# Restore a workspace page

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/archive/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Restore an archived workspace page. If its parent is archived, restore the parent before restoring the child; otherwise the API returns `400`.

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
<CodePanel title="Restore a workspace page" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/archive/" -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests
response = requests.delete("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/archive/", headers={"X-API-Key": "your-api-key"})
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/archive/", {
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
