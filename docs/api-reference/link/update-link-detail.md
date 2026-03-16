---
title: Update a link
description: Update a link via Plane API. HTTP request format, parameters, scopes, and example responses for update a link.
keywords: plane, plane api, rest api, api integration, link, update a link
---

# Update a link

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-items/{issue_id}/links/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Modify the URL, title, or metadata of an existing issue link.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="issue_id" type="string" :required="true">

Issue ID

</ApiParam>

<ApiParam name="pk" type="string" :required="true">

Link ID

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="title" type="string" :required="false">

Title.

</ApiParam>

<ApiParam name="url" type="string" :required="false">

Url.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items.links:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Update a link" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/links/550e8400-e29b-41d4-a716-446655440000/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "url": "https://example.com/resource",
  "title": "Example Name"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/links/550e8400-e29b-41d4-a716-446655440000/",
    headers={"X-API-Key": "your-api-key"},
    json={
      "url": "https://example.com/resource",
      "title": "Example Name"
    }
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/links/550e8400-e29b-41d4-a716-446655440000/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com/resource",
      title: "Example Name",
    }),
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
  "url": "https://example.com/resource",
  "title": "Example Name",
  "metadata": {
    "title": "Example Name",
    "description": "Example description",
    "image": "https://example.com/assets/example-image.png"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>

</div>
