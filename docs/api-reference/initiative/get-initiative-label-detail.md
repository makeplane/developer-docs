---
title: Retrieve an initiative label
description: Get retrieve an initiative label details via Plane API. Retrieve complete information for a specific resource.
keywords: plane, plane api, rest api, api integration, labels, tags, categorization, initiatives, roadmap, planning
---


# Retrieve an initiative label

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/initiatives/labels/{label_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieves the details of an existing initiative label by its ID.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="label_id" type="string" :required="true">

The unique identifier for the initiative label.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Retrieve an initiative label" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/labels/label-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/labels/label-uuid/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/labels/label-uuid/",
  {
    method: "GET",
    headers: {
      "X-API-Key": "your-api-key"
    }
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
