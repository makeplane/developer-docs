---
title: Update an attachment
description: Update an attachment via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks, attachments, files, uploads
---


# Update an attachment

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/attachments/{attachment_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing attachment by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

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

<ApiParam name="attachment_id" type="string" :required="true">

The unique identifier of the attachment.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="attributes" type="object">

File metadata object containing name, size, and type.

</ApiParam>

<ApiParam name="asset" type="string">

Storage path/identifier for the attachment file.

</ApiParam>

<ApiParam name="entity_type" type="string">

Entity type of the attachment.

</ApiParam>

<ApiParam name="entity_identifier" type="string">

Entity identifier for the attachment.

</ApiParam>

<ApiParam name="is_deleted" type="boolean">

Whether the attachment has been deleted.

</ApiParam>

<ApiParam name="is_archived" type="boolean">

Whether the attachment has been archived.

</ApiParam>

<ApiParam name="external_id" type="string">

External identifier if the attachment is imported to Plane.

</ApiParam>

<ApiParam name="external_source" type="string">

Name of the source if the attachment is imported to Plane.

</ApiParam>

<ApiParam name="size" type="number">

File size in bytes.

</ApiParam>

<ApiParam name="is_uploaded" type="boolean">

Whether the file has been successfully uploaded.

</ApiParam>

<ApiParam name="storage_metadata" type="object">

Cloud storage metadata.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update an attachment" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/attachments/{attachment_id}/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "attributes": "example-attributes",
  "asset": "example-asset",
  "entity_type": "example-entity_type",
  "entity_identifier": "example-entity_identifier",
  "is_deleted": true,
  "is_archived": true,
  "external_id": "example-external_id",
  "external_source": "example-external_source",
  "size": 1,
  "is_uploaded": true,
  "storage_metadata": "example-storage_metadata"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/attachments/{attachment_id}/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'attributes': 'example-attributes',
  'asset': 'example-asset',
  'entity_type': 'example-entity_type',
  'entity_identifier': 'example-entity_identifier',
  'is_deleted': true,
  'is_archived': true,
  'external_id': 'example-external_id',
  'external_source': 'example-external_source',
  'size': 1,
  'is_uploaded': true,
  'storage_metadata': 'example-storage_metadata'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/projects/project-uuid/work-items/work-item-uuid/attachments/{attachment_id}/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "attributes": "example-attributes",
  "asset": "example-asset",
  "entity_type": "example-entity_type",
  "entity_identifier": "example-entity_identifier",
  "is_deleted": true,
  "is_archived": true,
  "external_id": "example-external_id",
  "external_source": "example-external_source",
  "size": 1,
  "is_uploaded": true,
  "storage_metadata": "example-storage_metadata"
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
  "id": "project-uuid",
  "name": "Project Name",
  "identifier": "PROJ",
  "description": "Project description",
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
