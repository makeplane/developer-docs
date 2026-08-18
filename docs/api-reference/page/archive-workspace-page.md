---
title: Archive a workspace page
description: Archive a workspace page via the Plane API before deleting it.
keywords: plane, plane api, workspace page, archive wiki page
---

# Archive a workspace page

<div class="api-endpoint-badge"><span class="method post">POST</span><span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/archive/</span></div>

<div class="api-two-column"><div class="api-left">

Archive a workspace page and its subpages. A page must be archived before it can be deleted.

### Path Parameters

<ApiParam name="workspace_slug" type="string" :required="true">The workspace's unique slug.</ApiParam>
<ApiParam name="page_id" type="string" :required="true">The page UUID.</ApiParam>

### Scopes

`write` or `wiki.pages:write`

</div><div class="api-right">
<CodePanel title="Archive a workspace page" :languages="['cURL', 'Python', 'JavaScript']"><template #curl>

```bash
curl -X POST "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/archive/" -H "X-API-Key: $PLANE_API_KEY"
```

</template><template #python>

```python
import requests
response = requests.post("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/archive/", headers={"X-API-Key": "your-api-key"})
print(response.status_code)
```

</template><template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/archive/", {
  method: "POST",
  headers: { "X-API-Key": "your-api-key" },
});
```

</template></CodePanel>
<ResponsePanel status="204">No response body.</ResponsePanel>

</div></div>
