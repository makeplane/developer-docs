---
title: Retrieve a collection
description: Retrieve a visible Plane workspace collection by ID.
keywords: plane, plane api, rest api, collections, retrieve collection
---

# Retrieve a collection

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns a collection if the authenticated user can view it. An inaccessible private collection returns `404 Not Found`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace slug.

</ApiParam>
<ApiParam name="collection_id" type="uuid" :required="true">

The collection ID.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`read` or `wiki.pages:read`

</div>

</div>

<div class="api-right">
<CodePanel title="Retrieve a collection" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/"
print(requests.get(url, headers={"X-API-Key": "your-api-key"}).json())
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/";
const response = await fetch(url, { headers: { "X-API-Key": process.env.PLANE_API_KEY } });
console.log(await response.json());
```

</template>
</CodePanel>
<ResponsePanel status="200">

```json
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
```

</ResponsePanel>

</div>

</div>
