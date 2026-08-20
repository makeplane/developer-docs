---
title: Delete a collection
description: Delete a non-default Plane collection and optionally preserve its pages.
keywords: plane, plane api, rest api, collections, delete collection, archive pages
---

# Delete a collection

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Deletes a non-default collection. Pages are archived by default. Set `archive_pages=false` to preserve pages when
deleting a public collection; pages in a private collection are always archived.

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

### Query Parameters

<div class="params-list">

<ApiParam name="archive_pages" type="boolean" :required="false">

Whether to archive contained pages. Defaults to `true`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Delete a collection" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/?archive_pages=false" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/"
response = requests.delete(url, headers={"X-API-Key": "your-api-key"}, params={"archive_pages": "false"})
print(response.status_code)
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const url =
  "https://api.plane.so/api/v1/workspaces/my-workspace/collections/0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10/?archive_pages=false";
const response = await fetch(url, { method: "DELETE", headers: { "X-API-Key": process.env.PLANE_API_KEY } });
console.log(response.status);
```

</template>
</CodePanel>
<ResponsePanel status="204">

```text
No response body
```

</ResponsePanel>

</div>

</div>
