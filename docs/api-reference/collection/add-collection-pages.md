---
title: Add pages to a collection
description: Add one or more Plane workspace page trees to a collection.
keywords: plane, plane api, rest api, collection pages, add pages, page placement
---

# Add pages to a collection

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/pages/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Adds each selected page and its sub-pages. Adding to a private collection makes the page tree private; adding an owned
private page to a public collection makes it public. Private collections accept only root pages.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace slug.

</ApiParam>
<ApiParam name="collection_id" type="uuid" :required="true">

The destination collection ID.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="page_ids" type="uuid[]" :required="true">

One or more workspace page IDs.

</ApiParam>
<ApiParam name="sort_orders" type="object" :required="false">

Page-ID keys mapped to numeric sort orders. Every key must occur in `page_ids`.

</ApiParam>
<ApiParam name="placement" type="object" :required="false">

Placement with `type`: `append`, `before`, or `after`; optional `parent_id`; and required `target_page_id` for `before` or `after`. Before/after accepts exactly one page.

</ApiParam>

`placement` takes precedence over `sort_orders`. An `append` placement accepts multiple pages and preserves their order
from `page_ids`.

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Add pages to a collection" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/" \
  -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" \
  -d '{"page_ids":["ea8ccdab-1cf4-448b-8205-51e4b98d82b8"],"placement":{"type":"append","parent_id":null}}'
```

</template>
<template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/"
payload = {"page_ids": ["ea8ccdab-1cf4-448b-8205-51e4b98d82b8"], "placement": {"type": "append", "parent_id": None}}
print(requests.post(url, headers={"X-API-Key": "your-api-key"}, json=payload).json())
```

</template>
<template #javascript>

```javascript
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/";
const response = await fetch(url, {
  method: "POST",
  headers: { "X-API-Key": "your-api-key", "Content-Type": "application/json" },
  body: JSON.stringify({
    page_ids: ["ea8ccdab-1cf4-448b-8205-51e4b98d82b8"],
    placement: { type: "append", parent_id: null },
  }),
});
console.log(await response.json());
```

</template>
</CodePanel>
<ResponsePanel status="200">

```json
[
  {
    "id": "55ebf2cc-61ba-478a-b88c-88db969e29dc",
    "collection": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
    "page": "ea8ccdab-1cf4-448b-8205-51e4b98d82b8",
    "workspace": "95d1f03f-16e5-4807-a8c5-ec0c7cf0e4ab",
    "sort_order": 65535.0,
    "created_at": "2026-08-18T10:00:00Z",
    "updated_at": "2026-08-18T10:00:00Z",
    "created_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
    "updated_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f"
  }
]
```

</ResponsePanel>

The response `id` is the page placement ID. Use it as `page_collection_id` when moving, reordering, or removing the
page from a collection.

</div>

</div>
