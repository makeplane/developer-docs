---
title: Create work item
description: Create work item via Plane API. HTTP request format, parameters, scopes, and example responses for create work item.
keywords: plane, plane api, rest api, api integration, issue, create work item
---

# Create work item

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-items/create/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Create a new work item with support for custom properties.

**Required fields:**

- `name`: Work item title

**Conditional requirements:**

- `type_id`: Required when project has work item types enabled

**Standard fields:**

- `description_html`: HTML formatted description
- `priority`: One of: urgent, high, medium, low, none (default: none)
- `state_id`: State ID (defaults to project's default state)
- `assignee_ids`: List of user IDs to assign
- `label_ids`: List of label IDs
- `start_date`: Format YYYY-MM-DD
- `target_date`: Format YYYY-MM-DD
- `parent_id`: Parent work item ID for sub-issues
- `estimate_point_id`: Estimate point ID

**Custom fields:**

- Use `custom_field_{name}` format for custom property values
- Field names must match property names from the schema endpoint
- Values must match the property type (TEXT, DECIMAL, OPTION UUID, etc.)

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="project_id" type="string" :required="true">

Project ID

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Work item title (required)

</ApiParam>

<ApiParam name="type_id" type="string" :required="false">

Work item type ID

</ApiParam>

<ApiParam name="description_html" type="string" :required="false">

HTML formatted description

</ApiParam>

<ApiParam name="priority" type="string" :required="false">

Priority level

- `urgent` - urgent
- `high` - high
- `medium` - medium
- `low` - low
- `none` - none

</ApiParam>

<ApiParam name="state_id" type="string" :required="false">

State ID

</ApiParam>

<ApiParam name="assignee_ids" type="array" :required="false">

List of assignee user IDs

</ApiParam>

<ApiParam name="label_ids" type="array" :required="false">

List of label IDs

</ApiParam>

<ApiParam name="start_date" type="string" :required="false">

Start date (YYYY-MM-DD)

</ApiParam>

<ApiParam name="target_date" type="string" :required="false">

Target date (YYYY-MM-DD)

</ApiParam>

<ApiParam name="parent_id" type="string" :required="false">

Parent work item ID

</ApiParam>

<ApiParam name="estimate_point_id" type="string" :required="false">

Estimate point ID

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Create work item" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/create/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Example Name"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/create/",
    headers={"X-API-Key": "your-api-key"},
    json={
      "name": "Example Name"
    }
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/create/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Example Name",
    }),
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Example Name",
  "sequence_id": 1,
  "project_id": "550e8400-e29b-41d4-a716-446655440000",
  "workspace_id": "550e8400-e29b-41d4-a716-446655440000",
  "state_id": "550e8400-e29b-41d4-a716-446655440000",
  "type_id": "550e8400-e29b-41d4-a716-446655440000",
  "priority": "Example Name",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>

</div>
