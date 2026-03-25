---
title: Retrieve a customer property value
description: Retrieve a customer property value via Plane API. HTTP request format, parameters, scopes, and example responses for retrieve a customer property value.
keywords: plane, plane api, rest api, api integration, customer, retrieve a customer property value
---

# Retrieve a customer property value

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{slug}/customers/{customer_id}/property-values/{property_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve values for a specific property of a customer.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="customer_id" type="string" :required="true">

Customer id.

</ApiParam>

<ApiParam name="property_id" type="string" :required="true">

Property id.

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Slug.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`customers.property_values:read`

</div>

</div>

<div class="api-right">

<CodePanel title="Retrieve a customer property value" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/property-values/550e8400-e29b-41d4-a716-446655440001/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/property-values/550e8400-e29b-41d4-a716-446655440001/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/property-values/550e8400-e29b-41d4-a716-446655440001/",
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
  "detail": "Property values retrieved successfully"
}
```

</ResponsePanel>

</div>

</div>
