---
title: Delete a customer request
description: Delete a customer request via Plane API. HTTP request format, parameters, scopes, and example responses for delete a customer request.
keywords: plane, plane api, rest api, api integration, customer, delete a customer request
---

# Delete a customer request

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/customers/{customer_id}/requests/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Permanently delete a customer request and unlink any linked issue

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="customer_id" type="string" :required="true">

Customer id.

</ApiParam>

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

`customers.requests:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Delete a customer request" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/requests/550e8400-e29b-41d4-a716-446655440000/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/requests/550e8400-e29b-41d4-a716-446655440000/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/requests/550e8400-e29b-41d4-a716-446655440000/",
  {
    method: "DELETE",
    headers: {
      "X-API-Key": "your-api-key",
    },
  }
);
console.log(response.status);
```

</template>
</CodePanel>

<ResponsePanel status="204">

No response body.

</ResponsePanel>

</div>

</div>
