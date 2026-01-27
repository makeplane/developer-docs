---
title: Link work items to customer
description: Link work items to customer API endpoint. Request format, parameters, and response examples for Plane REST API.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks, customers, crm, customer management
---


# Link work items to customer

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/customers/{customer_id}/work-items/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Links one or more work items to a customer.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="customer_id" type="string" :required="true">

The unique identifier for the customer.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="issue_ids" type="string[]" :required="true">

Array of work item IDs to link to the customer.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Link work items to customer" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/{customer_id}/work-items/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "issue_ids": "example-issue_ids"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/customers/{customer_id}/work-items/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'issue_ids': 'example-issue_ids'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/customers/{customer_id}/work-items/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "issue_ids": "example-issue_ids"
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
  "id": "work-item-uuid",
  "name": "Work Item Title",
  "state": "state-uuid",
  "priority": 2,
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
