---
title: Get workspace asset
description: Get workspace asset via Plane API. HTTP request format, parameters, scopes, and example responses for get workspace asset.
keywords: plane, plane api, rest api, api integration, assets, get workspace asset
---

# Get workspace asset

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/assets/{asset_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Get presigned URL for asset download

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="asset_id" type="string" :required="true">

Asset id.

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`assets:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Get workspace asset" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/assets/550e8400-e29b-41d4-a716-446655440002/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/assets/550e8400-e29b-41d4-a716-446655440002/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/assets/550e8400-e29b-41d4-a716-446655440002/",
  {
    method: "GET",
    headers: {
      "X-API-Key": "your-api-key",
    },
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
  "name": "design-spec.pdf",
  "type": "application/pdf",
  "asset_url": "https://cdn.example.com/workspace-assets/design-spec.pdf",
  "attributes": {
    "entity_type": "WORKSPACE"
  }
}
```

</ResponsePanel>

</div>

</div>
