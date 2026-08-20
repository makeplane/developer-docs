---
title: Update a workspace page
description: Update the title or content of a workspace page via the Plane API.
keywords: plane, plane api, rest api, workspace page, update wiki page
---

# Update a workspace page

<div class="api-endpoint-badge">
  <span class="method put">PUT</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/pages/{page_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Update a workspace page. Send `name`, `description_html`, or both. `description_html` replaces the page's current content rather than appending to it. Plane applies the mutation through its collaborative document service so API writes remain consistent with active editor sessions. Locked or archived pages cannot be updated. The API returns `502` when the collaborative document service cannot complete the update and `503` when that service is not configured.

See [Page content HTML](/api-reference/page/page-content-html) for supported HTML and Plane editor components.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace's unique slug.

</ApiParam>
<ApiParam name="page_id" type="string" :required="true">

The page UUID.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="false">

The new page title.

</ApiParam>
<ApiParam name="description_html" type="string" :required="false">

HTML that replaces the current page content.

</ApiParam>

At least one body parameter is required.

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Update a workspace page" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PUT "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Release notes","description_html":"<p>Current release notes</p>"}'
```

</template>
<template #python>

```python
import requests

response = requests.put(
    "https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/",
    headers={"X-API-Key": "your-api-key"},
    json={"name": "Release notes", "description_html": "<p>Current release notes</p>"},
)
print(response.json())
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/pages/page-uuid/", {
  method: "PUT",
  headers: { "X-API-Key": process.env.PLANE_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Release notes", description_html: "<p>Current release notes</p>" }),
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Release notes",
  "description_html": "<p>Current release notes</p>"
}
```

</ResponsePanel>
</div>

</div>
