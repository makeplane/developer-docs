---
title: Update a collection member
description: Change a Plane collection member's access level.
keywords: plane, plane api, rest api, collection members, update member access
---

# Update a collection member

<div class="api-endpoint-badge"><span class="method patch">PATCH</span><span class="path">/api/v1/workspaces/{workspace_slug}/collections/{collection_id}/members/{member_id}/</span></div>

<div class="api-two-column"><div class="api-left">

Changes an explicit collection membership's access level. `member_id` identifies the membership record, not the user.

### Path Parameters

<ApiParam name="workspace_slug" type="string" :required="true">The workspace slug.</ApiParam>
<ApiParam name="collection_id" type="uuid" :required="true">The collection ID.</ApiParam>
<ApiParam name="member_id" type="uuid" :required="true">The collection membership ID.</ApiParam>

### Body Parameters

<ApiParam name="access" type="integer" :required="false">`0` (view), `1` (comment), or `2` (edit).</ApiParam>

### OAuth scope

`write` or `wiki.pages:write`

</div><div class="api-right">
<CodePanel title="Update a collection member" :languages="['cURL', 'Python', 'JavaScript']"><template #curl>

```bash
curl -X PATCH "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/membership-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" -d '{"access":2}'
```

</template><template #python>

```python
import requests
url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/membership-uuid/"
print(requests.patch(url, headers={"X-API-Key": "your-api-key"}, json={"access": 2}).json())
```

</template><template #javascript>

```javascript
const url = "https://api.plane.so/api/v1/workspaces/my-workspace/collections/collection-uuid/members/membership-uuid/";
const response = await fetch(url, {
  method: "PATCH",
  headers: { "X-API-Key": "your-api-key", "Content-Type": "application/json" },
  body: JSON.stringify({ access: 2 }),
});
console.log(await response.json());
```

</template></CodePanel>
<ResponsePanel status="200">

```json
{
  "id": "4edec253-26f4-4667-8f52-9488dca1c620",
  "collection": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
  "member": "6f356c85-bb22-47e0-b8b1-cf18aa6adad3",
  "access": 2,
  "workspace": "95d1f03f-16e5-4807-a8c5-ec0c7cf0e4ab",
  "created_at": "2026-08-18T10:00:00Z",
  "updated_at": "2026-08-18T10:05:00Z",
  "created_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
  "updated_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f"
}
```

</ResponsePanel></div></div>
