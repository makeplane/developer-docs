---
title: Create an initiative label
description: Create an initiative label via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, labels, tags, categorization, initiatives, roadmap, planning
---


# Create an initiative label

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/initiatives/labels/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new label for categorizing initiatives in a workspace.

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

<ApiParam name="name" type="string" :required="true">

Name of the initiative label.

</ApiParam>

<ApiParam name="description" type="string">

Description of the initiative label.

</ApiParam>

<ApiParam name="color" type="string">

Hex color code for the initiative label (e.g., "#eb5757").

</ApiParam>

<ApiParam name="sort_order" type="number">

Sort order for display purposes.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Create an initiative label" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/labels/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description": "example-description",
  "color": "example-color",
  "sort_order": 1
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/labels/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description': 'example-description',
  'color': 'example-color',
  'sort_order': 1
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/labels/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description": "example-description",
  "color": "example-color",
  "sort_order": 1
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
