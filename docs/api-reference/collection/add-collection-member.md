---
title: Add a collection member
description: Grant a workspace user access to a private Plane collection.
keywords: plane, plane api, rest api, collection members, add member, private collection
---

# Add a collection member

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/members/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Adds an explicit member to a private collection. The caller must be able to manage the collection.

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

<ApiParam name="member" type="uuid" :required="true">

The workspace user's ID.

</ApiParam>
<ApiParam name="access" type="integer" :required="false">

`0` (view, default), `1` (comment), or `2` (edit).

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Add a collection member" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/" \
  -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" \
  -d '{"member":"6f356c85-bb22-47e0-b8b1-cf18aa6adad3","access":0}'
```

</template>
<template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/"
response = requests.post(url, headers={"X-API-Key": "your-api-key"}, json={"member": "6f356c85-bb22-47e0-b8b1-cf18aa6adad3", "access": 0})
print(response.json())
```

</template>
<template #javascript>

```javascript
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/";
const response = await fetch(url, {
  method: "POST",
  headers: { "X-API-Key": "your-api-key", "Content-Type": "application/json" },
  body: JSON.stringify({ member: "6f356c85-bb22-47e0-b8b1-cf18aa6adad3", access: 0 }),
});
console.log(await response.json());
```

</template>
</CodePanel>
<ResponsePanel status="201">

```json
{
  "id": "4edec253-26f4-4667-8f52-9488dca1c620",
  "collection": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
  "member": "6f356c85-bb22-47e0-b8b1-cf18aa6adad3",
  "access": 0,
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
