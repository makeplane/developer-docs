---
title: Update a customer request
description: Update a customer request via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, customers, crm, customer management
---


# Update a customer request

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/customers/{customer_id}/requests/{request_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing customer request by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="customer_id" type="string" :required="true">

The unique identifier for the customer.

</ApiParam>

<ApiParam name="request_id" type="string" :required="true">

The unique identifier for the request.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="title" type="string">

Title of the request.

</ApiParam>

<ApiParam name="description" type="string">

Description of the request.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update a customer request" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/{customer_id}/requests/{request_id}/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "title": "example-title",
  "description": "example-description"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/customers/{customer_id}/requests/{request_id}/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'title': 'example-title',
  'description': 'example-description'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/{customer_id}/requests/{request_id}/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "title": "example-title",
  "description": "example-description"
})
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
