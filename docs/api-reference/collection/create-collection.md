---
title: Create a collection
description: Create a public or private collection in a Plane workspace.
keywords: plane, plane api, rest api, collections, create collection, private collection
---

# Create a collection

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a collection. Private collections can only be created by workspace admins when the feature is available. The
creator of a private collection is automatically added as a member with edit access.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace slug.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="false">

The collection name. Defaults to an empty string.

</ApiParam>
<ApiParam name="access" type="integer" :required="false">

`0` for public (default) or `1` for private.

</ApiParam>
<ApiParam name="logo_props" type="object" :required="false">

Logo or emoji properties. Defaults to an empty object.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Create a collection" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST "https://api.plane.so/api/v1/workspaces/my-workspace/collections/" \
  -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Product docs","access":0,"logo_props":{"emoji":"📚"}}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/collections/",
    headers={"X-API-Key": "your-api-key"},
    json={"name": "Product docs", "access": 0, "logo_props": {"emoji": "📚"}},
)
print(response.json())
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/collections/", {
  method: "POST",
  headers: { "X-API-Key": process.env.PLANE_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Product docs", access: 0, logo_props: { emoji: "📚" } }),
});
console.log(await response.json());
```

</template>
</CodePanel>
<ResponsePanel status="201">

```json
{
  "id": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
  "name": "Product docs",
  "owned_by_id": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
  "access": 0,
  "current_user_access": null,
  "has_pages": false,
  "is_default": false,
  "is_global": true,
  "logo_props": { "emoji": "📚" },
  "sort_order": 65535.0,
  "workspace": "95d1f03f-16e5-4807-a8c5-ec0c7cf0e4ab",
  "created_at": "2026-08-18T10:00:00Z",
  "updated_at": "2026-08-18T10:00:00Z",
  "created_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
  "updated_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f"
}
```

</ResponsePanel>

</div>

</div>
