---
title: Remove a page from a collection
description: Remove a Plane page tree from its collection.
keywords: plane, plane api, rest api, collection pages, remove page
---

# Remove a page from a collection

<div class="api-endpoint-badge"><span class="method delete">DELETE</span><span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/pages/{page_collection_id}/</span></div>

<div class="api-two-column"><div class="api-left">

Removes the page and its descendants from the collection. A sub-page cannot be removed independently from a private
collection. Removing a private collection root requires permission to move that page tree out of the collection.

### Path Parameters

<ApiParam name="workspace_slug" type="string" :required="true">The workspace slug.</ApiParam>
<ApiParam name="collection_id" type="uuid" :required="true">The collection ID.</ApiParam>
<ApiParam name="page_collection_id" type="uuid" :required="true">The page membership ID returned as `page_collection_id` by the list endpoint.</ApiParam>

### OAuth scope

`write` or `wiki.pages:write`

</div><div class="api-right">
<CodePanel title="Remove a page from a collection" :languages="['cURL', 'Python', 'JavaScript']"><template #curl>

```bash
curl -X DELETE "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/membership-uuid/" -H "X-API-Key: $PLANE_API_KEY"
```

</template><template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/membership-uuid/"
print(requests.delete(url, headers={"X-API-Key": "your-api-key"}).status_code)
```

</template><template #javascript>

```javascript
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/pages/membership-uuid/";
const response = await fetch(url, { method: "DELETE", headers: { "X-API-Key": "your-api-key" } });
console.log(response.status);
```

</template></CodePanel>
<ResponsePanel status="204">

```text
No response body
```

</ResponsePanel></div></div>
