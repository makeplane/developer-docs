---
title: Add labels to initiative
description: Create labels to initiative via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, labels, tags, categorization, initiatives, roadmap, planning
---


# Add labels to initiative

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/initiatives/{initiative_id}/labels/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Adds one or more labels to an initiative.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="initiative_id" type="string" :required="true">

The unique identifier for the initiative.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="label_ids" type="string[]" :required="true">

Array of initiative label IDs to add to the initiative.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Add labels to initiative" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/{initiative_id}/labels/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "label_ids": "example-label_ids"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/{initiative_id}/labels/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'label_ids': 'example-label_ids'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/{initiative_id}/labels/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "label_ids": "example-label_ids"
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
