---
title: Move or reorder a collection page
description: Move a Plane page tree to another collection or change its collection order.
keywords: plane, plane api, rest api, collection pages, move page, reorder page
---

# Move or reorder a collection page

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/pages/{page_collection_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Reorders a page or moves its page tree to another visible collection. A private collection's sub-page cannot be moved
independently. Moving a private page to a public collection makes its tree public when permitted. Moving a root page
out of a private collection requires workspace admin access, or ownership of the page tree together with edit access
to the source collection. Moving into a private collection also requires access to the destination collection.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace slug.

</ApiParam>
<ApiParam name="collection_id" type="uuid" :required="true">

The source collection ID.

</ApiParam>
<ApiParam name="page_collection_id" type="uuid" :required="true">

The page membership ID returned as `page_collection_id` by the list endpoint.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="collection" type="uuid" :required="false">

A destination collection ID. Omit or use the source ID to reorder in place.

</ApiParam>
<ApiParam name="sort_order" type="number" :required="false">

An explicit ordering value.

</ApiParam>
<ApiParam name="placement" type="object" :required="false">

Placement with `type`: `append`, `before`, or `after`; optional `parent_id`; and required `target_page_id` for before/after. Overrides `sort_order`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Move or reorder a collection page" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH "https://api.plane.so/api/v1/workspaces/my-workspace/collections/source-uuid/pages/membership-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" \
  -d '{"collection":"target-collection-uuid","placement":{"type":"append"}}'
```

</template>
<template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/source-uuid/pages/membership-uuid/"
payload = {"collection": "target-collection-uuid", "placement": {"type": "append"}}
print(requests.patch(url, headers={"X-API-Key": "your-api-key"}, json=payload).json())
```

</template>
<template #javascript>

```javascript
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/source-uuid/pages/membership-uuid/";
const response = await fetch(url, {
  method: "PATCH",
  headers: { "X-API-Key": "your-api-key", "Content-Type": "application/json" },
  body: JSON.stringify({ collection: "target-collection-uuid", placement: { type: "append" } }),
});
console.log(await response.json());
```

</template>
</CodePanel>
<ResponsePanel status="200">

```json
{
  "id": "55ebf2cc-61ba-478a-b88c-88db969e29dc",
  "collection": "82c72604-2019-43b7-930f-692af61f3ea7",
  "page": "ea8ccdab-1cf4-448b-8205-51e4b98d82b8",
  "workspace": "95d1f03f-16e5-4807-a8c5-ec0c7cf0e4ab",
  "sort_order": 65535.0,
  "created_at": "2026-08-18T10:00:00Z",
  "updated_at": "2026-08-18T10:05:00Z",
  "created_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
  "updated_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f"
}
```

</ResponsePanel>

</div>

</div>
