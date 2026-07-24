---
title: Delete a module
description: Delete a module from a Plane project with the v2 REST API. Path parameters, what happens to the module's work items, OAuth scopes, error codes, and code examples.
keywords: plane api v2, delete module, remove module, DELETE modules, soft delete
---

# Delete a module

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v2/workspaces/{slug}/projects/{project_id}/modules/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Delete a module. The work items that were grouped by it stay in the project — only the grouping goes away.

This is a soft delete: the module stops appearing in reads and its name is freed up for reuse in the project.

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

The module to delete.

</ApiParam>

</div>
</div>

::: info 204, then 404
A successful delete returns `204` with an empty body — there is nothing to parse. A second `DELETE` on the same id
returns `404 resource_not_found`, so a retry after a dropped connection is safe to treat as success.
:::

<div class="params-section">

### Scopes

`projects.modules:write`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                               |
| ------ | -------------------- | ------------------------------------------------------------------- |
| `401`  | `unauthorized`       | Missing or invalid credentials.                                     |
| `403`  | `forbidden`          | Your role or token scope can't delete this module.                  |
| `404`  | `resource_not_found` | No such module, workspace, or project, or it's outside your tenant. |
| `429`  | `rate_limited`       | Throttled. Wait for the interval in `Retry-After` and retry.        |

</div>

</div>

<div class="api-right">

<CodePanel title="Delete a module" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/modules/7c1f3d90-2a64-4e58-9b0d-3fa1c7e28b45/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b"
    "/modules/7c1f3d90-2a64-4e58-9b0d-3fa1c7e28b45/",
    headers={"X-Api-Key": "your-api-key"},
)
print(response.status_code)  # 204
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/modules/7c1f3d90-2a64-4e58-9b0d-3fa1c7e28b45/",
  {
    method: "DELETE",
    headers: { "X-Api-Key": "your-api-key" },
  }
);
console.log(response.status); // 204
```

</template>
</CodePanel>

<ResponsePanel status="204">

No response body.

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
