---
title: Download a workspace page attachment
description: Download an uploaded workspace page attachment through a presigned redirect.
keywords: plane, plane api, workspace page, download attachment
---

# Download a workspace page attachment

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/attachments/{attachment_id}/download/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Validate access and receive a `302` redirect to a temporary presigned download URL. An attachment that has not been confirmed as uploaded returns `400`.

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
<CodePanel title="Download an attachment" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -L "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/download/" -H "X-API-Key: $PLANE_API_KEY" --output diagram.png
```

</template>
<template #python>

```python
import requests
response = requests.get("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/download/", headers={"X-API-Key": "your-api-key"})
open("diagram.png", "wb").write(response.content)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/download/",
  { headers: { "X-API-Key": "your-api-key" }, redirect: "follow" }
);
const file = await response.blob();
```

</template>
</CodePanel>
<ResponsePanel status="302">

The `Location` header contains the temporary presigned download URL.

</ResponsePanel>

</div>

</div>
