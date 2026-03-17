---
title: Get upload credentials
description: Get upload credentials via Plane API. HTTP request format, parameters, scopes, and example responses for get upload credentials.
keywords: plane, plane api, rest api, api integration, issue attachments, get upload credentials
---

# Get upload credentials

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{slug}/projects/{project_id}/work-items/{issue_id}/attachments/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Generate presigned URL for uploading file attachments to a work item.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="issue_id" type="string" :required="true">

Issue ID

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

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Original filename of the asset

</ApiParam>

<ApiParam name="type" type="string" :required="false">

MIME type of the file

</ApiParam>

<ApiParam name="size" type="integer" :required="true">

File size in bytes

</ApiParam>

<ApiParam name="external_id" type="string" :required="false">

External identifier for the asset (for integration tracking)

</ApiParam>

<ApiParam name="external_source" type="string" :required="false">

External source system (for integration tracking)

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.work_items.attachments:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Get upload credentials" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/attachments/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Example Name",
  "type": "application/pdf",
  "size": 1024000,
  "external_id": "550e8400-e29b-41d4-a716-446655440000",
  "external_source": "github"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/attachments/",
    headers={"X-API-Key": "your-api-key"},
    json={
      "name": "Example Name",
      "type": "application/pdf",
      "size": 1024000,
      "external_id": "550e8400-e29b-41d4-a716-446655440000",
      "external_source": "github"
    }
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/550e8400-e29b-41d4-a716-446655440000/work-items/550e8400-e29b-41d4-a716-446655440001/attachments/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Example Name",
      type: "application/pdf",
      size: 1024000,
      external_id: "550e8400-e29b-41d4-a716-446655440000",
      external_source: "github",
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
  "detail": "Presigned download URL generated successfully"
}
```

</ResponsePanel>

</div>

</div>
