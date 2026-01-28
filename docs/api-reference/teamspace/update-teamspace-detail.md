---
title: Update a teamspace
description: Update a teamspace via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration
---


# Update a teamspace

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/teamspaces/{teamspace_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing teamspace by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="teamspace_id" type="string" :required="true">

The unique identifier for the teamspace.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string">

Name of the teamspace.

</ApiParam>

<ApiParam name="description_json" type="object">

JSON representation of the teamspace description.

</ApiParam>

<ApiParam name="description_html" type="string">

HTML-formatted description of the teamspace.

</ApiParam>

<ApiParam name="description_stripped" type="string">

Stripped version of the HTML description.

</ApiParam>

<ApiParam name="description_binary" type="string">

Binary representation of the description.

</ApiParam>

<ApiParam name="logo_props" type="object">

Logo properties for the teamspace

</ApiParam>

<ApiParam name="lead" type="string">

ID of the user who leads the teamspace.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update a teamspace" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description_json": "example-description_json",
  "description_html": "example-description_html",
  "description_stripped": "example-description_stripped",
  "description_binary": "example-description_binary",
  "logo_props": "example-logo_props",
  "lead": "example-lead"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description_json': 'example-description_json',
  'description_html': 'example-description_html',
  'description_stripped': 'example-description_stripped',
  'description_binary': 'example-description_binary',
  'logo_props': 'example-logo_props',
  'lead': 'example-lead'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/{teamspace_id}/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description_json": "example-description_json",
  "description_html": "example-description_html",
  "description_stripped": "example-description_stripped",
  "description_binary": "example-description_binary",
  "logo_props": "example-logo_props",
  "lead": "example-lead"
})
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "resource-uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
