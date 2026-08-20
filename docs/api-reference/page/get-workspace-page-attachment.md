---
title: Retrieve workspace page attachment metadata
description: Retrieve metadata for an attachment linked to a workspace page.
keywords: plane, plane api, workspace page, attachment metadata
---

# Retrieve workspace page attachment metadata

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/attachments/{attachment_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve metadata and links for an existing workspace page attachment. The caller must be able to view the page.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace's unique slug.

</ApiParam>
<ApiParam name="page_id" type="string" :required="true">

The workspace page UUID.

</ApiParam>
<ApiParam name="attachment_id" type="string" :required="true">

The attachment asset UUID.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`read` or `wiki.pages:read`

</div>

</div>

<div class="api-right">
<CodePanel title="Retrieve attachment metadata" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/" -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests
response = requests.get("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/", headers={"X-API-Key": "your-api-key"})
print(response.json())
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/",
  { headers: { "X-API-Key": process.env.PLANE_API_KEY } }
);
const data = await response.json();
```

</template>
</CodePanel>
<ResponsePanel status="200">

```json
{
  "id": "attachment-uuid",
  "page_id": "page-uuid",
  "name": "diagram.png",
  "type": "image/png",
  "size": 24576,
  "is_uploaded": true,
  "asset_url": "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/",
  "_links": {
    "download": "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/download/"
  }
}
```

</ResponsePanel>
</div>

</div>
