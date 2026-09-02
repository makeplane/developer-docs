---
title: List collection pages
description: List and filter a branch of pages in a Plane collection.
keywords: plane, plane api, rest api, collection pages, list pages, page filters
---

# List collection pages

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/pages/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns a paginated branch of visible pages. By default, it returns the collection's root pages.
Pass `next_cursor` back as `cursor` to continue until `next_page_results` is `false`.

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

<ApiParam name="parent_id" type="uuid" :required="false">

Return direct children of this page.

</ApiParam>
<ApiParam name="search" type="string" :required="false">

Case-insensitive page-name search.

</ApiParam>
<ApiParam name="created_by" type="string" :required="false">

Comma-separated creator IDs.

</ApiParam>
<ApiParam name="favorites" type="boolean" :required="false">

Filter by the current user's favorite status.

</ApiParam>
<ApiParam name="labels" type="string" :required="false">

Comma-separated label IDs.

</ApiParam>
<ApiParam name="created_at__gte" type="date" :required="false">

Created on or after this date.

</ApiParam>
<ApiParam name="created_at__lte" type="date" :required="false">

Created on or before this date.

</ApiParam>
<ApiParam name="owned_by_id" type="uuid" :required="false">

Filter by owner.

</ApiParam>
<ApiParam name="owned_by_id__in" type="string" :required="false">

Comma-separated owner IDs.

</ApiParam>
<ApiParam name="parent_id__in" type="string" :required="false">

Comma-separated parent IDs.

</ApiParam>
<ApiParam name="per_page" type="integer" :required="false">

Results per page. Defaults to 50; maximum 100.

</ApiParam>
<ApiParam name="cursor" type="string" :required="false">

Cursor returned by a previous page.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`read` or `wiki.pages:read`

</div>

</div>

<div class="api-right">
<CodePanel title="List collection pages" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/?search=API&per_page=50" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/"
response = requests.get(url, headers={"X-API-Key": "your-api-key"}, params={"search": "API", "per_page": 50})
print(response.json())
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const url =
  "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/?search=API&per_page=50";
const response = await fetch(url, { headers: { "X-API-Key": process.env.PLANE_API_KEY } });
console.log(await response.json());
```

</template>
</CodePanel>
<ResponsePanel status="200">

```json
{
  "next_cursor": "50:50:0",
  "prev_cursor": "50:0:0",
  "next_page_results": false,
  "prev_page_results": false,
  "count": 1,
  "total_pages": 1,
  "total_results": 1,
  "extra_stats": null,
  "results": [
    {
      "page_collection_id": "55ebf2cc-61ba-478a-b88c-88db969e29dc",
      "collection_id": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
      "parent_id": null,
      "sort_order": 65535.0,
      "page": {
        "id": "ea8ccdab-1cf4-448b-8205-51e4b98d82b8",
        "name": "API guide",
        "access": 0,
        "logo_props": {},
        "parent_id": null,
        "collection_id": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
        "workspace": "95d1f03f-16e5-4807-a8c5-ec0c7cf0e4ab",
        "sub_pages_count": 2,
        "is_shared": false,
        "owned_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
        "updated_at": "2026-08-18T10:00:00Z",
        "created_at": "2026-08-18T10:00:00Z",
        "created_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
        "updated_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
        "is_favorite": false,
        "label_ids": []
      }
    }
  ]
}
```

</ResponsePanel>

</div>

</div>
