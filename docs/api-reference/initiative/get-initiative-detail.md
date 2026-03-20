---
title: Retrieve an initiative
description: Retrieve an initiative via Plane API. HTTP request format, parameters, scopes, and example responses for retrieve an initiative.
keywords: plane, plane api, rest api, api integration, initiative, retrieve an initiative
---

# Retrieve an initiative

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/initiatives/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve an initiative by its ID

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="initiative_id" type="string" :required="true">

Initiative ID

</ApiParam>

<ApiParam name="pk" type="string" :required="true">

Pk.

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`initiatives:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Retrieve an initiative" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440000/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440000/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/550e8400-e29b-41d4-a716-446655440000/",
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
  "name": "Example Name",
  "description": "Example description"
}
```

</ResponsePanel>

</div>

</div>
