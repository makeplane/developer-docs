---
title: Create a module
description: Create a module in a Plane project with the v2 REST API. Body parameters, the module status enum, lead validation, OAuth scopes, error codes, and code examples.
keywords: plane api v2, create module, module status, lead_id, POST modules, project modules
---

# Create a module

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v2/workspaces/{slug}/projects/{project_id}/modules/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Create a module in a project. Only `name` is required — everything else can be filled in later with a `PATCH` as the
work firms up.

Module names must be unique within a project — reusing one returns `409 conflict`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string (uuid)" :required="true">

The project to create the module in.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Display name for the module, unique within the project. Maximum 255 characters.

</ApiParam>

<ApiParam name="description" type="string" :required="false">

Plain-text summary of what the module covers.

</ApiParam>

<ApiParam name="status" type="string" :required="false">

Where the module sits in its lifecycle.

- `backlog` — Captured, not yet committed to
- `planned` — Committed to but not started
- `in-progress` — Actively being worked on
- `paused` — Started, then put on hold
- `completed` — Delivered
- `cancelled` — Dropped without delivering

Defaults to `planned` when omitted. A value outside this list is a `400 validation_error`.

</ApiParam>

<ApiParam name="start_date" type="string (date)" :required="false">

Date the module is scheduled to begin, as `YYYY-MM-DD`. Nullable.

</ApiParam>

<ApiParam name="target_date" type="string (date)" :required="false">

Date the module is expected to land, as `YYYY-MM-DD`. Nullable, and must not be earlier than `start_date`.

</ApiParam>

<ApiParam name="lead_id" type="string (uuid)" :required="false">

The user accountable for the module. Must be a member of this project — any other user id is rejected with a `400`
naming `lead_id`, never linked silently. Nullable.

</ApiParam>

<ApiParam name="sort_order" type="number" :required="false">

Ordering weight used when modules are listed. Lower values sort first. In a project that already has modules, Plane
positions the new module ahead of them on create, so send `sort_order` in a follow-up `PATCH` if you need a specific
slot.

</ApiParam>

<ApiParam name="logo_props" type="any" :required="false">

Free-form JSON object holding the icon Plane renders for the module.

</ApiParam>

<ApiParam name="external_id" type="string" :required="false">

Your system's identifier for this module, for sync and import correlation. Maximum 255 characters. Nullable.

</ApiParam>

<ApiParam name="external_source" type="string" :required="false">

The system `external_id` came from, for example `github` or `jira`. Maximum 255 characters. Nullable.

</ApiParam>

</div>
</div>

::: info Members aren't set here
`member_ids` is read-only in v2, so a module is created with no members. Module membership is not yet writable through
the v2 API.
:::

<div class="params-section">

### Scopes

`projects.modules:write`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                                                                                        |
| ------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `400`  | `validation_error`   | Missing `name`, a `status` outside the enum, a `lead_id` who isn't a project member, or a `target_date` before `start_date`. |
| `401`  | `unauthorized`       | Missing or invalid credentials.                                                                                              |
| `403`  | `forbidden`          | Your role or token scope can't create modules in this project.                                                               |
| `404`  | `resource_not_found` | No such workspace or project, or it's outside your tenant.                                                                   |
| `409`  | `conflict`           | A module with this name already exists in the project.                                                                       |
| `429`  | `rate_limited`       | Throttled. Wait for the interval in `Retry-After` and retry.                                                                 |

</div>

</div>

<div class="api-right">

<CodePanel title="Create a module" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/modules/" \
  -H "X-Api-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Billing revamp",
  "description": "Rework subscription billing end to end.",
  "status": "in-progress",
  "start_date": "2026-01-05",
  "target_date": "2026-02-27",
  "lead_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/modules/",
    headers={"X-Api-Key": "your-api-key"},
    json={
        "name": "Billing revamp",
        "description": "Rework subscription billing end to end.",
        "status": "in-progress",
        "start_date": "2026-01-05",
        "target_date": "2026-02-27",
        "lead_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
    },
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/modules/",
  {
    method: "POST",
    headers: {
      "X-Api-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Billing revamp",
      description: "Rework subscription billing end to end.",
      status: "in-progress",
      start_date: "2026-01-05",
      target_date: "2026-02-27",
      lead_id: "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
    }),
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "7c1f3d90-2a64-4e58-9b0d-3fa1c7e28b45",
  "name": "Billing revamp",
  "description": "Rework subscription billing end to end.",
  "status": "in-progress",
  "start_date": "2026-01-05",
  "target_date": "2026-02-27",
  "lead_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "member_ids": [],
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

<ResponsePanel status="409">

```json
{
  "type": "https://api.plane.so/errors/conflict",
  "title": "Conflict",
  "status": 409,
  "code": "conflict",
  "detail": "A module with this name already exists in the project."
}
```

</ResponsePanel>

</div>
</div>
