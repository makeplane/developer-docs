---
title: List collections
description: List the collections visible to the authenticated user in a Plane workspace.
keywords: plane, plane api, rest api, collections, list collections, wiki
---

# List collections

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns all public and permitted private collections in sort order. A private collection is included when the caller
owns it, is a workspace admin, or is an explicit collection member.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace slug.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`read` or `wiki.pages:read`

</div>

</div>

<div class="api-right">

<CodePanel title="List collections" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl "https://api.plane.so/api/v1/workspaces/my-workspace/collections/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/collections/",
    headers={"X-API-Key": "your-api-key"},
)
print(response.json())
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/collections/", {
  headers: { "X-API-Key": process.env.PLANE_API_KEY },
});
console.log(await response.json());
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
[
  {
    "id": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
    "name": "Product docs",
    "owned_by_id": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
    "access": 0,
    "current_user_access": null,
    "has_pages": true,
    "is_default": false,
    "is_global": true,
    "logo_props": {},
    "sort_order": 65535.0,
    "workspace": "95d1f03f-16e5-4807-a8c5-ec0c7cf0e4ab",
    "created_at": "2026-08-18T10:00:00Z",
    "updated_at": "2026-08-18T10:00:00Z",
    "created_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
    "updated_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f"
  }
]
```

</ResponsePanel>

</div>

</div>
