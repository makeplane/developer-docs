---
title: Get a module
description: Retrieve a single module from a Plane project with the v2 REST API. Path parameters, OAuth scopes, error codes, and code examples.
keywords: plane api v2, get module, retrieve module, module by id, GET modules
---

# Get a module

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v2/workspaces/{slug}/projects/{project_id}/modules/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve one module by id. The response is the same shape a list row uses, so you can refresh a single module without
re-reading the whole collection.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string (uuid)" :required="true">

The project the module belongs to.

</ApiParam>

<ApiParam name="pk" type="string (uuid)" :required="true">

The module to retrieve.

</ApiParam>

</div>
</div>

::: info A module in another project is a 404
`pk` is resolved inside `project_id`. A valid module id from a different project — or from another workspace — returns
`404 resource_not_found`, not `403`. The API never reveals that a resource you can't see exists.
:::

<div class="params-section">

### Scopes

`projects.modules:read`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                               |
| ------ | -------------------- | ------------------------------------------------------------------- |
| `401`  | `unauthorized`       | Missing or invalid credentials.                                     |
| `403`  | `forbidden`          | Your role or token scope can't read modules in this project.        |
| `404`  | `resource_not_found` | No such module, workspace, or project, or it's outside your tenant. |
| `429`  | `rate_limited`       | Throttled. Wait for the interval in `Retry-After` and retry.        |

</div>

</div>

<div class="api-right">

<CodePanel title="Get a module" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/modules/7c1f3d90-2a64-4e58-9b0d-3fa1c7e28b45/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b"
    "/modules/7c1f3d90-2a64-4e58-9b0d-3fa1c7e28b45/",
    headers={"X-Api-Key": "your-api-key"},
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/modules/7c1f3d90-2a64-4e58-9b0d-3fa1c7e28b45/",
  {
    headers: { "X-Api-Key": "your-api-key" },
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "7c1f3d90-2a64-4e58-9b0d-3fa1c7e28b45",
  "name": "Billing revamp",
  "description": "Rework subscription billing end to end.",
  "status": "in-progress",
  "start_date": "2026-01-05",
  "target_date": "2026-02-27",
  "lead_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "member_ids": ["16c61a3a-512a-48ac-b0be-b6b46fe6f430", "9d3e1f27-8b4c-4a06-95f1-2c7ea45b0d18"],
  "sort_order": 65535.0,
  "logo_props": {},
  "external_id": null,
  "external_source": null,
  "archived_at": null,
  "created_at": "2026-01-14T09:22:41.478363Z",
  "created_by_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430"
}
```

</ResponsePanel>

<ResponsePanel status="404">

```json
{
  "type": "https://api.plane.so/errors/resource_not_found",
  "title": "Not Found",
  "status": 404,
  "code": "resource_not_found",
  "detail": "No Module matches the given query."
}
```

</ResponsePanel>

</div>
</div>
