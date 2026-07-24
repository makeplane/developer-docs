---
title: Delete a state
description: Delete a workflow state from a Plane project with the v2 REST API. Protected default states, states holding work items, OAuth scopes, error codes, and code examples.
keywords: plane api v2, delete state, remove workflow state, default state conflict, 409 conflict, DELETE states
---

# Delete a state

<div class="api-endpoint-badge">
  <span class="method delete">DELETE</span>
  <span class="path">/api/v2/workspaces/{slug}/projects/{project_id}/states/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Remove a state from a project's workflow. A successful delete returns `204` with an empty body.

Two conditions block a delete, and you have to clear the condition before the state will go — see [Before you delete](#before-you-delete).

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string (uuid)" :required="true">

The project the state belongs to.

</ApiParam>

<ApiParam name="pk" type="string (uuid)" :required="true">

The id of the state to delete.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.states:write`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                               |
| ------ | -------------------- | ------------------------------------------------------------------- |
| `401`  | `unauthorized`       | Missing or invalid credentials.                                     |
| `403`  | `forbidden`          | Your role or token scope can't delete states.                       |
| `404`  | `resource_not_found` | No such state, project, or workspace — or it's outside your tenant. |
| `409`  | `conflict`           | This is the project's default state.                                |
| `409`  | `conflict`           | The state still holds work items.                                   |
| `429`  | `rate_limited`       | Throttled. Honor the `Retry-After` header before retrying.          |

</div>

</div>

<div class="api-right">

<CodePanel title="Delete a state" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X DELETE \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/f960d3c2-8524-4a41-b8eb-055ce4be2a7f/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.delete(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/f960d3c2-8524-4a41-b8eb-055ce4be2a7f/",
    headers={"X-Api-Key": "your-api-key"},
)
print(response.status_code)
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/f960d3c2-8524-4a41-b8eb-055ce4be2a7f/",
  {
    method: "DELETE",
    headers: {
      "X-Api-Key": "your-api-key",
    },
  }
);
console.log(response.status);
```

</template>
</CodePanel>

<ResponsePanel status="204">

No response body.

</ResponsePanel>

<ResponsePanel status="409" title="DEFAULT STATE">

```json
{
  "type": "https://api.plane.so/errors/conflict",
  "title": "Conflict",
  "status": 409,
  "code": "conflict",
  "detail": "The default state cannot be deleted."
}
```

</ResponsePanel>

<ResponsePanel status="409" title="STATE HOLDS WORK ITEMS">

```json
{
  "type": "https://api.plane.so/errors/conflict",
  "title": "Conflict",
  "status": 409,
  "code": "conflict",
  "detail": "This state still has work items in it."
}
```

</ResponsePanel>

</div>
</div>

## Before you delete

Both protected cases return `409 conflict`, so branch on the `detail` only for messaging — the fix differs:

- **The project's default state.** Every project needs somewhere for work items to land when no `state_id` is supplied. Promote another state with [Update a state](/api-reference/v2/states/update-state) and `"is_default": true`, which demotes the current default, then delete it.
- **A state that still holds work items.** Deleting it would leave those work items without a status. Move them to another state first — filter the project's work items by this state, `PATCH` each one to the replacement state, then retry the delete.

A safe teardown is therefore: reassign work items, hand off the default flag if this state has it, delete.

::: tip Deletes are soft
The state stops appearing in the API and in Plane, but the row is retained. Treat the `204` as final for integration purposes — the states API has no restore operation.
:::
