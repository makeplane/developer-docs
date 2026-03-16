---
title: Update work item with properties
description: Update work item with properties via Plane API. HTTP request format, parameters, scopes, and example responses for update work item with properties.
keywords: plane, plane api, rest api, api integration, issue, update work item with properties
---

# Update work item with properties

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-items/{pk}/properties/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Update a work item's standard fields and/or custom properties.

Accepts both standard issue fields and custom property fields:

- Standard fields: name, priority, state_id, assignee_ids, label_ids, etc.
- Custom fields: `custom_field_<name>` with value or {"value": ...} format

For OPTION type custom fields, you can pass either:

- The option UUID
- The option name (case-insensitive)

Custom properties can only be updated if the ISSUE_TYPES feature is enabled.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="issue_id" type="string" :required="true">

Issue ID

</ApiParam>

<ApiParam name="pk" type="string" :required="true">

Pk.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Update work item with properties" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/properties/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/properties/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440000/properties/",
  {
    method: "PATCH",
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
  "name": "Example Name",
  "priority": "high"
}
```

</ResponsePanel>

</div>

</div>
