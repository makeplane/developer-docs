---
title: Get a cycle
description: Retrieve a single Plane cycle by id with the v2 REST API. Path parameters, response fields, OAuth scopes, error codes, and code examples.
keywords: plane api v2, get cycle, retrieve cycle, cycle by id, GET cycles
---

# Get a cycle

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v2/workspaces/{slug}/projects/{project_id}/cycles/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Fetch one cycle by id. The response is the same cycle object the list endpoint returns for each row, so you only need this call when you already hold an id.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string (uuid)" :required="true">

The project the cycle belongs to. A cycle id from a different project returns `404`, not the record.

</ApiParam>

<ApiParam name="pk" type="string (uuid)" :required="true">

The cycle to retrieve.

</ApiParam>

</div>
</div>

::: info No `?expand=` on cycles
Cycles do not support `?expand=`. `owned_by_id` and `created_by_id` are always plain ids — resolve them against the members endpoints when you need display names.
:::

<div class="params-section">

### Scopes

`projects.cycles:read`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                               |
| ------ | -------------------- | ------------------------------------------------------------------- |
| `401`  | `unauthorized`       | Missing or invalid credentials.                                     |
| `403`  | `forbidden`          | Your role or token scope can't read cycles in this project.         |
| `404`  | `resource_not_found` | No such cycle, wrong project, or the record is outside your tenant. |
| `429`  | `rate_limited`       | Throttled. Honor the `Retry-After` header before retrying.          |

</div>

</div>

<div class="api-right">

<CodePanel title="Get a cycle" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/cycles/7c1f9a4e-3b6d-4a52-8f0c-2d9e6b18c3a7/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/cycles/7c1f9a4e-3b6d-4a52-8f0c-2d9e6b18c3a7/",
    headers={"X-Api-Key": "your-api-key"},
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/cycles/7c1f9a4e-3b6d-4a52-8f0c-2d9e6b18c3a7/",
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
  "id": "7c1f9a4e-3b6d-4a52-8f0c-2d9e6b18c3a7",
  "name": "Sprint 24",
  "description": "Checkout rewrite and billing cleanup",
  "start_date": "2026-01-05T00:00:00Z",
  "end_date": "2026-01-19T00:00:00Z",
  "timezone": "America/New_York",
  "owned_by_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "sort_order": 65535,
  "logo_props": {},
  "external_id": null,
  "external_source": null,
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
  "detail": "No cycle matches the given id in this project."
}
```

</ResponsePanel>

</div>
</div>
