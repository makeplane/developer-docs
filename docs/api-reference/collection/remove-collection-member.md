---
title: Remove a collection member
description: Revoke a user's explicit access to a private Plane collection.
keywords: plane, plane api, rest api, collection members, remove member
---

# Remove a collection member

<div class="api-endpoint-badge"><span class="method delete">DELETE</span><span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/members/{member_id}/</span></div>

<div class="api-two-column"><div class="api-left">

Removes an explicit collection membership. `member_id` identifies the membership record, not the user.

### Path Parameters

<ApiParam name="workspace_slug" type="string" :required="true">The workspace slug.</ApiParam>
<ApiParam name="collection_id" type="uuid" :required="true">The collection ID.</ApiParam>
<ApiParam name="member_id" type="uuid" :required="true">The collection membership ID.</ApiParam>

### OAuth scope

`write` or `wiki.pages:write`

</div><div class="api-right">
<CodePanel title="Remove a collection member" :languages="['cURL', 'Python', 'JavaScript']"><template #curl>

```bash
curl -X DELETE "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/membership-uuid/" -H "X-API-Key: $PLANE_API_KEY"
```

</template><template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/membership-uuid/"
print(requests.delete(url, headers={"X-API-Key": "your-api-key"}).status_code)
```

</template><template #javascript>

```javascript
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/membership-uuid/";
const response = await fetch(url, { method: "DELETE", headers: { "X-API-Key": "your-api-key" } });
console.log(response.status);
```

</template></CodePanel>
<ResponsePanel status="204">

```text
No response body
```

</ResponsePanel></div></div>
