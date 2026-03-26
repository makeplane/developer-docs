---
title: Get upload credentials
description: List upload credentials via Plane API. HTTP GET request with pagination, filtering, and query parameters.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks, attachments, files, uploads
---

# Get upload credentials

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/attachments/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a pre-signed POST form data for uploading an attachment directly to S3. This endpoint handles the first step of the two-and-a-half step upload process where you first get the upload credentials and then use them to upload the actual file.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string" :required="true">

The unique identifier of the project.

</ApiParam>

<ApiParam name="work_item_id" type="string" :required="true">

The unique identifier of the work item.

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
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/attachments/" \
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
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/attachments/",
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
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/attachments/", {
  method: "POST",
  headers: {
    "X-API-Key": "your-api-key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
  "name": "Example Name",
  "type": "application/pdf",
  "size": 1024000,
  "external_id": "550e8400-e29b-41d4-a716-446655440000",
  "external_source": "github"
}),
});
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
