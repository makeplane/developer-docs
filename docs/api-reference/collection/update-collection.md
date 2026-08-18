---
title: Update a collection
description: Update a Plane collection's name, logo, or sort order.
keywords: plane, plane api, rest api, collections, update collection
---

# Update a collection

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Partially updates a collection. Its public or private access cannot be changed after creation.

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

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="false">

A new collection name.

</ApiParam>
<ApiParam name="logo_props" type="object" :required="false">

New logo or emoji properties.

</ApiParam>
<ApiParam name="sort_order" type="number" :required="false">

The collection's ordering value.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Update a collection" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/" \
  -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"API docs","sort_order":25000}'
```

</template>
<template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/"
response = requests.patch(url, headers={"X-API-Key": "your-api-key"}, json={"name": "API docs", "sort_order": 25000})
print(response.json())
```

</template>
<template #javascript>

```javascript
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/";
const response = await fetch(url, {
  method: "PATCH",
  headers: { "X-API-Key": "your-api-key", "Content-Type": "application/json" },
  body: JSON.stringify({ name: "API docs", sort_order: 25000 }),
});
console.log(await response.json());
```

</template>
</CodePanel>
<ResponsePanel status="200">

```json
{
  "id": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
  "name": "API docs",
  "owned_by_id": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
  "access": 0,
  "current_user_access": null,
  "has_pages": true,
  "is_default": false,
  "is_global": true,
  "logo_props": {},
  "sort_order": 25000.0,
  "workspace": "95d1f03f-16e5-4807-a8c5-ec0c7cf0e4ab",
  "created_at": "2026-08-18T10:00:00Z",
  "updated_at": "2026-08-18T10:05:00Z",
  "created_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
  "updated_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f"
}
```

</ResponsePanel>

</div>

</div>
