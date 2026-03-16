---
title: Retrieve a customer
description: Retrieve a customer via Plane API. HTTP request format, parameters, scopes, and example responses for retrieve a customer.
keywords: plane, plane api, rest api, api integration, customer, retrieve a customer
---

# Retrieve a customer

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/customers/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Get a specific customer by ID

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="pk" type="string" :required="true">

Pk.

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Slug.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`customers:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Retrieve a customer" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440000/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440000/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440000/",
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
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "name": "Example Name",
  "description": "example-value",
  "deleted_at": "2024-01-01T00:00:00Z",
  "customer_request_count": 1,
  "logo_url": "Example Name",
  "description_html": "<p>Example content</p>",
  "description_stripped": "Example description",
  "description_binary": "Example description",
  "email": "Example Name"
}
```

</ResponsePanel>

</div>

</div>
