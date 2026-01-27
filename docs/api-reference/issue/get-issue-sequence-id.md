---
title: Retrieve a work item by identifier
description: List retrieve a work item by identifier via Plane API. HTTP GET request with pagination, filtering, and query parameters.
keywords: plane, plane api, rest api, api integration, work items, issues, tasks
---


# Retrieve a work item by identifier

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/work-items/{identifier}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieves the details of a work item using its readable identifier (e.g., PROJ-123).

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="identifier" type="string" :required="true">

Work item identifier in the format PROJECT-123 (e.g., ENG-123)

</ApiParam>

</div>
</div>

<div class="params-section">

### Query Parameters

<div class="params-list">

<ApiParam name="expand" type="string">

Comma-separated list of fields to expand. Possible values: `type`, `module`, `labels`, `assignees`, `state`, `project`.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Retrieve a work item by identifier" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v1/workspaces/my-workspace/work-items/{identifier}/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v1/workspaces/my-workspace/work-items/{identifier}/",
    headers={"X-API-Key": "your-api-key"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/work-items/{identifier}/",
  {
    method: "GET",
    headers: {
      "X-API-Key": "your-api-key"
    }
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

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
