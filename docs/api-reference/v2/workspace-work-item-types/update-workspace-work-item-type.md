---
title: Update a workspace work item type
description: Update a workspace-level work item type in Plane with the v2 REST API. Partial PATCH body, workspace mode requirement, OAuth scopes, error codes, and code examples.
keywords: plane api v2, update workspace work item type, rename issue type, deactivate type, workspace mode, PATCH work item type
---

# Update a workspace work item type

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v2/workspaces/{slug}/work-item-types/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Rename a type, rewrite its description, or retire it with `is_active: false`. The edit lands once and every project working from the workspace list sees it — that is the point of managing types at the workspace level.

The update is partial: omitted fields are left untouched, and omitting a field is not the same as sending `null`. There is no `PUT`.

::: warning Workspace mode required
This write only succeeds while the workspace manages work item types at the workspace level. In project mode it returns `409` with code `work_item_types_managed_at_project`. See [Work item type modes](/api-reference/v2/work-item-type-modes).
:::

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is `my-team`.

</ApiParam>

<ApiParam name="pk" type="string (uuid)" :required="true">

The id of the work item type to update.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

Every field is optional — send only what changes.

<div class="params-list">

<ApiParam name="name" type="string" :required="false">

New display name. Maximum 255 characters. Renaming is safe for integrations that key on `id`; anything matching on the old name breaks, which is a reason to key on `id`.

</ApiParam>

<ApiParam name="description" type="string" :required="false">

New description of what the type is for.

</ApiParam>

<ApiParam name="is_active" type="boolean" :required="false">

Send `false` to retire the type from pickers without deleting it — work items already classified with it keep their type. Send `true` to bring it back.

</ApiParam>

<ApiParam name="external_id" type="string" :required="false">

Your system's identifier for this type. Maximum 255 characters. Send `null` to clear it. Write-only — it is not returned on read.

</ApiParam>

<ApiParam name="external_source" type="string" :required="false">

The system `external_id` came from, for example `jira`. Maximum 255 characters. Send `null` to clear it. Write-only, like `external_id`.

</ApiParam>

</div>

`is_default`, `is_epic`, `level`, and `logo_props` are read-only — sending them has no effect. To change which type is the default, call [Mark a type as default](/api-reference/v2/workspace-work-item-types/mark-default-workspace-work-item-type).

</div>

<div class="params-section">

### Scopes

`workspaces.work_item_types:write`

</div>

<div class="params-section">

### Errors

| Status | Code                                 | Cause                                                                        |
| ------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| `400`  | `validation_error`                   | An invalid value — for example a `name` over 255 characters. See `errors[]`. |
| `401`  | `unauthorized`                       | Missing or invalid credentials.                                              |
| `403`  | `forbidden`                          | Your role or token scope can't write workspace types.                        |
| `404`  | `resource_not_found`                 | No such type or workspace, or it's outside your tenant.                      |
| `409`  | `work_item_types_managed_at_project` | The workspace manages types at the project level. Use the project endpoint.  |
| `409`  | `conflict`                           | The change collides with another type — most often a name already in use.    |
| `429`  | `rate_limited`                       | Throttled. Honor the `Retry-After` header before retrying.                   |

</div>

</div>

<div class="api-right">

<CodePanel title="Update a workspace work item type" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v2/workspaces/my-team/work-item-types/c1a7d3f4-6b28-4e90-8d15-2f7a0b9c4e63/" \
  -H "X-Api-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Defect",
  "description": "A confirmed break in shipped behavior"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v2/workspaces/my-team/work-item-types/c1a7d3f4-6b28-4e90-8d15-2f7a0b9c4e63/",
    headers={"X-Api-Key": "your-api-key"},
    json={
        "name": "Defect",
        "description": "A confirmed break in shipped behavior",
    },
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/work-item-types/c1a7d3f4-6b28-4e90-8d15-2f7a0b9c4e63/",
  {
    method: "PATCH",
    headers: {
      "X-Api-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Defect",
      description: "A confirmed break in shipped behavior",
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
  "id": "c1a7d3f4-6b28-4e90-8d15-2f7a0b9c4e63",
  "name": "Defect",
  "description": "A confirmed break in shipped behavior",
  "is_active": true,
  "is_default": false,
  "is_epic": false,
  "level": 0,
  "logo_props": {},
  "created_at": "2026-01-14T09:22:41.478363Z"
}
```

</ResponsePanel>

<ResponsePanel status="409" title="WRONG MODE">

```json
{
  "type": "https://api.plane.so/errors/work-item-types-managed-at-project",
  "title": "Conflict",
  "status": 409,
  "code": "work_item_types_managed_at_project",
  "detail": "This workspace manages work item types at the project level. Update the type on the project's work item types endpoint."
}
```

</ResponsePanel>

</div>
</div>

::: tip Deactivate before you delete
`is_active: false` is the reversible move: the type stops appearing in pickers, existing work items keep their classification, and you can undo it with one call. Reach for [Delete](/api-reference/v2/workspace-work-item-types/delete-workspace-work-item-type) only when the type should be gone for good.
:::
