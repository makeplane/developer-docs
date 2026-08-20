---
title: Archive a project page
description: Archive a project page via the Plane API before deleting it.
keywords: plane, plane api, project page, archive page
---

# Archive a project page

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/pages/{page_id}/archive/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Archive a project page and its subpages. A page must be archived before it can be deleted.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace's unique slug.

</ApiParam>
<ApiParam name="project_id" type="string" :required="true">

The project UUID.

</ApiParam>
<ApiParam name="page_id" type="string" :required="true">

The page UUID.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `projects.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Archive a project page" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/pages/page-uuid/archive/" -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests
response = requests.post("https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/pages/page-uuid/archive/", headers={"X-API-Key": "your-api-key"})
print(response.status_code)
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/pages/page-uuid/archive/",
  { method: "POST", headers: { "X-API-Key": process.env.PLANE_API_KEY } }
);
```

</template>
</CodePanel>

<ResponsePanel status="204">

No response body.

</ResponsePanel>

</div>

</div>
