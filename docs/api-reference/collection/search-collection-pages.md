---
title: Search addable collection pages
description: Search for workspace pages that can be added to a Plane collection.
keywords: plane, plane api, rest api, collection pages, search pages, addable pages
---

# Search addable collection pages

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/pages-search/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns eligible root pages that are not already assigned to the collection. Results respect page and private
collection permissions. Without `search`, the endpoint returns at most 10 results. With `search`, it performs a
case-insensitive page-name search without that limit.

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

### Query Parameters

<div class="params-list">

<ApiParam name="search" type="string" :required="false">

A page-name search string.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`read` or `wiki.pages:read`

</div>

</div>

<div class="api-right">
<CodePanel title="Search addable collection pages" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages-search/?search=API" -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages-search/"
print(requests.get(url, headers={"X-API-Key": "your-api-key"}, params={"search": "API"}).json())
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages-search/?search=API";
const response = await fetch(url, { headers: { "X-API-Key": process.env.PLANE_API_KEY } });
console.log(await response.json());
```

</template>
</CodePanel>
<ResponsePanel status="200">

```json
[
  {
    "id": "ea8ccdab-1cf4-448b-8205-51e4b98d82b8",
    "name": "API guide",
    "logo_props": { "emoji": "📘" }
  }
]
```

</ResponsePanel>

</div>

</div>
