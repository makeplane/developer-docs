---
title: Update project features
description: Update project features via Plane API. HTTP request format, parameters, scopes, and example responses for update project features.
keywords: plane, plane api, rest api, api integration, project features, update project features
---

# Update project features

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/features/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Update the features of a project

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

<ApiParam name="epics" type="boolean" :required="false">

Epics.

</ApiParam>

<ApiParam name="modules" type="boolean" :required="false">

Modules.

</ApiParam>

<ApiParam name="cycles" type="boolean" :required="false">

Cycles.

</ApiParam>

<ApiParam name="views" type="boolean" :required="false">

Views.

</ApiParam>

<ApiParam name="pages" type="boolean" :required="false">

Pages.

</ApiParam>

<ApiParam name="intakes" type="boolean" :required="false">

Intakes.

</ApiParam>

<ApiParam name="work_item_types" type="boolean" :required="false">

Work item types.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.features:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Update project features" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/features/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "epics": true,
  "modules": true,
  "cycles": true,
  "views": true,
  "pages": true,
  "intakes": true,
  "work_item_types": true
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/features/",
    headers={"X-API-Key": "your-api-key"},
    json={
      "epics": true,
      "modules": true,
      "cycles": true,
      "views": true,
      "pages": true,
      "intakes": true,
      "work_item_types": true
    }
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/features/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      epics: true,
      modules: true,
      cycles: true,
      views: true,
      pages: true,
      intakes: true,
      work_item_types: true,
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
  "epics": true,
  "modules": true,
  "cycles": true,
  "views": true,
  "pages": true,
  "intakes": true,
  "work_item_types": true
}
```

</ResponsePanel>

</div>

</div>
