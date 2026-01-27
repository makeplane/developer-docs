---
title: List all teamspaces
description: List all teamspaces via Plane API. HTTP GET request with pagination, filtering, and query parameters.
keywords: plane, plane api, rest api, api integration
---


# List all teamspaces

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/teamspaces/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Returns a list of all teamspaces in a workspace.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Query Parameters

<div class="params-list">

<ApiParam name="limit" type="number">

Number of results to return per page.

</ApiParam>

<ApiParam name="offset" type="number">

Number of results to skip for pagination.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="List all teamspaces" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/",
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
