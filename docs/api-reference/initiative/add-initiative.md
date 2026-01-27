---
title: Create an initiative
description: Create an initiative via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, initiatives, roadmap, planning
---


# Create an initiative

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/initiatives/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new initiative in a workspace.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Name of the initiative.

</ApiParam>

<ApiParam name="description" type="string">

Plain text description of the initiative.

</ApiParam>

<ApiParam name="description_html" type="string">

HTML-formatted description of the initiative.

</ApiParam>

<ApiParam name="description_stripped" type="string">

Stripped version of the HTML description.

</ApiParam>

<ApiParam name="description_binary" type="string">

Binary representation of the description.

</ApiParam>

<ApiParam name="lead" type="string">

ID of the user who leads the initiative.

</ApiParam>

<ApiParam name="start_date" type="string">

Start date in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="end_date" type="string">

End date in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="logo_props" type="object">

Logo properties for the initiative

</ApiParam>

<ApiParam name="state" type="string">

Current state of the initiative. Possible values: `DRAFT`, `PLANNED`, `ACTIVE`, `COMPLETED`, `CLOSED`.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Create an initiative" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "description": "example-description",
  "description_html": "example-description_html",
  "description_stripped": "example-description_stripped",
  "description_binary": "example-description_binary",
  "lead": "example-lead",
  "start_date": "example-start_date",
  "end_date": "example-end_date",
  "logo_props": "example-logo_props",
  "state": "example-state"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'description': 'example-description',
  'description_html': 'example-description_html',
  'description_stripped': 'example-description_stripped',
  'description_binary': 'example-description_binary',
  'lead': 'example-lead',
  'start_date': 'example-start_date',
  'end_date': 'example-end_date',
  'logo_props': 'example-logo_props',
  'state': 'example-state'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/initiatives/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "description": "example-description",
  "description_html": "example-description_html",
  "description_stripped": "example-description_stripped",
  "description_binary": "example-description_binary",
  "lead": "example-lead",
  "start_date": "example-start_date",
  "end_date": "example-end_date",
  "logo_props": "example-logo_props",
  "state": "example-state"
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
  "id": "resource-uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
