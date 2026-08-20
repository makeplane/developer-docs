---
title: Update a project page
description: Update the title or content of a project page via the Plane API.
keywords: plane, plane api, project page, update page
---

# Update a project page

<div class="api-endpoint-badge">
  <span class="method put">PUT</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/pages/{page_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Send `name`, `description_html`, or both. `description_html` replaces the current content, and Plane sanitizes it before
storing it. See [Page content HTML](/api-reference/page/page-content-html) for supported HTML and Plane editor
components. Locked or archived pages return `400`; document-service failures return `502`, and an unconfigured service
returns `503`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace's unique slug.

</ApiParam>
<ApiParam name="project_id" type="string" :required="true">

The project UUID.

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

HTML that Plane sanitizes and uses to replace the current page content.

</ApiParam>

At least one body parameter is required.

</div>
</div>

<div class="params-section">

### Scopes

`write` or `projects.pages:write`

</div>

</div>

<div class="api-right">
<CodePanel title="Update a project page" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PUT "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/pages/page-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"Release notes","description_html":"<p>Current release notes</p>"}'
```

</template>
<template #python>

```python
import requests
response = requests.put("https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/pages/page-uuid/", headers={"X-API-Key": "your-api-key"}, json={"name": "Release notes", "description_html": "<p>Current release notes</p>"})
print(response.json())
```

</template>
<template #javascript>

```javascript
// Run this example server-side. Browser apps must call your backend to keep the API key secret.
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/pages/page-uuid/",
  {
    method: "PUT",
    headers: { "X-API-Key": process.env.PLANE_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Release notes", description_html: "<p>Current release notes</p>" }),
  }
);
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
