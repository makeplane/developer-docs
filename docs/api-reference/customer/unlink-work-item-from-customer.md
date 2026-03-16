---
title: Unlink work item from customer
description: Unlink work item from customer via Plane API. HTTP request format, parameters, scopes, and example responses for unlink work item from customer.
keywords: plane, plane api, rest api, api integration, customer, unlink work item from customer
---

# Unlink work item from customer

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v1/workspaces/{slug}/customers/{customer_id}/issues/{issue_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Remove the link between an issue and a customer/customer request.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="customer_id" type="string" :required="true">

Customer id.

</ApiParam>

<ApiParam name="issue_id" type="string" :required="true">

Issue id.

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Slug.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`customers.work_items:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Unlink work item from customer" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/issues/550e8400-e29b-41d4-a716-446655440001/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/issues/550e8400-e29b-41d4-a716-446655440001/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/550e8400-e29b-41d4-a716-446655440001/issues/550e8400-e29b-41d4-a716-446655440001/",
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
