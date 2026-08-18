---
title: Confirm a workspace page attachment upload
description: Confirm the upload status of an attachment linked to a workspace page.
keywords: plane, plane api, workspace page, confirm attachment upload
---

# Confirm a workspace page attachment upload

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/attachments/{attachment_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Set an attachment's upload status after uploading it through the generic asset upload flow. This operation queues storage metadata extraction when needed. The page must be editable and cannot be locked or archived.

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

### Body Parameters

<div class="params-list">

<ApiParam name="is_uploaded" type="boolean" :required="false">

Whether the attachment was uploaded successfully. Defaults to `true`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Confirm an attachment upload" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/" -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" -d '{"is_uploaded":true}'
```

</template>
<template #python>

```python
import requests
response = requests.patch("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/", headers={"X-API-Key": "your-api-key"}, json={"is_uploaded": True})
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/",
  {
    method: "PATCH",
    headers: { "X-API-Key": "your-api-key", "Content-Type": "application/json" },
    body: JSON.stringify({ is_uploaded: true }),
  }
);
```

</template>
</CodePanel>

<ResponsePanel status="204">

No response body.

</ResponsePanel>

</div>

</div>
