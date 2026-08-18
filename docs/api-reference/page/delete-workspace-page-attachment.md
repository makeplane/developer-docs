---
title: Delete a workspace page attachment
description: Delete an attachment linked to a workspace page via the Plane API.
keywords: plane, plane api, workspace page, delete attachment
---

# Delete a workspace page attachment

<div class="api-endpoint-badge"><span class="method delete">DELETE</span><span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/attachments/{attachment_id}/</span></div>

<div class="api-two-column"><div class="api-left">

Soft-delete an attachment from an editable workspace page. Later metadata and download requests return `404`. Locked or archived pages cannot be changed.

### Path Parameters

<ApiParam name="workspace_slug" type="string" :required="true">The workspace's unique slug.</ApiParam>
<ApiParam name="page_id" type="string" :required="true">The workspace page UUID.</ApiParam>
<ApiParam name="attachment_id" type="string" :required="true">The attachment asset UUID.</ApiParam>

### Scopes

`write` or `wiki.pages:write`

</div><div class="api-right">
<CodePanel title="Delete an attachment" :languages="['cURL', 'Python', 'JavaScript']"><template #curl>

```bash
curl -X DELETE "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/" -H "X-API-Key: $PLANE_API_KEY"
```

</template><template #python>

```python
import requests
response = requests.delete("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/", headers={"X-API-Key": "your-api-key"})
print(response.status_code)
```

</template><template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/attachments/attachment-uuid/",
  { method: "DELETE", headers: { "X-API-Key": "your-api-key" } }
);
```

</template></CodePanel><ResponsePanel status="204">No response body.</ResponsePanel>

</div></div>
