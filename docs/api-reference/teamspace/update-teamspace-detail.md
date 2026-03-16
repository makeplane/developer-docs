---
title: Update a teamspace
description: Update a teamspace via Plane API. HTTP request format, parameters, scopes, and example responses for update a teamspace.
keywords: plane, plane api, rest api, api integration, teamspace, update a teamspace
---

# Update a teamspace

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{slug}/teamspaces/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Update a teamspace by its ID

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="pk" type="string" :required="true">

Pk.

</ApiParam>

<ApiParam name="slug" type="string" :required="true">

Workspace slug

</ApiParam>

<ApiParam name="teamspace_id" type="string" :required="true">

Teamspace ID

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="logo_props" type="object" :required="false">

Logo props.

</ApiParam>

<ApiParam name="name" type="string" :required="false">

Name.

</ApiParam>

<ApiParam name="description_json" type="object" :required="false">

Description json.

</ApiParam>

<ApiParam name="description_html" type="string" :required="false">

Description html.

</ApiParam>

<ApiParam name="description_stripped" type="string" :required="false">

Description stripped.

</ApiParam>

<ApiParam name="created_by" type="string" :required="false">

Created by.

</ApiParam>

<ApiParam name="updated_by" type="string" :required="false">

Updated by.

</ApiParam>

<ApiParam name="lead" type="string" :required="false">

Lead.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`teamspaces:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Update a teamspace" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/550e8400-e29b-41d4-a716-446655440000/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "logo_props": "example-value",
  "name": "Example Name",
  "description_json": "example-value",
  "description_html": "<p>Example content</p>",
  "description_stripped": "Example description",
  "created_by": "550e8400-e29b-41d4-a716-446655440000",
  "updated_by": "550e8400-e29b-41d4-a716-446655440000",
  "lead": "550e8400-e29b-41d4-a716-446655440000"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/550e8400-e29b-41d4-a716-446655440000/",
    headers={"X-API-Key": "your-api-key"},
    json={
      "logo_props": "example-value",
      "name": "Example Name",
      "description_json": "example-value",
      "description_html": "<p>Example content</p>",
      "description_stripped": "Example description",
      "created_by": "550e8400-e29b-41d4-a716-446655440000",
      "updated_by": "550e8400-e29b-41d4-a716-446655440000",
      "lead": "550e8400-e29b-41d4-a716-446655440000"
    }
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/teamspaces/550e8400-e29b-41d4-a716-446655440000/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      logo_props: "example-value",
      name: "Example Name",
      description_json: "example-value",
      description_html: "<p>Example content</p>",
      description_stripped: "Example description",
      created_by: "550e8400-e29b-41d4-a716-446655440000",
      updated_by: "550e8400-e29b-41d4-a716-446655440000",
      lead: "550e8400-e29b-41d4-a716-446655440000",
    }),
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
