---
title: Create a sticky
description: Create a sticky via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration
---


# Create a sticky

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/stickies/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new sticky note in a workspace.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string">

Name of the sticky.

</ApiParam>

<ApiParam name="description_html" type="string">

HTML-formatted content of the sticky.

</ApiParam>

<ApiParam name="logo_props" type="object">

Logo properties and visual configuration.

</ApiParam>

<ApiParam name="color" type="string">

Text color for the sticky (hex code).

</ApiParam>

<ApiParam name="background_color" type="string">

Background color for the sticky (hex code).

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Create a sticky" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/stickies/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description_html": "example-description_html",
  "logo_props": "example-logo_props",
  "color": "example-color",
  "background_color": "example-background_color"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/stickies/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description_html': 'example-description_html',
  'logo_props': 'example-logo_props',
  'color': 'example-color',
  'background_color': 'example-background_color'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/stickies/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description_html": "example-description_html",
  "logo_props": "example-logo_props",
  "color": "example-color",
  "background_color": "example-background_color"
})
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "resource-uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
