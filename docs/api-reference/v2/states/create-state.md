---
title: Create a state
description: Create a workflow state in a Plane project with the v2 REST API. Body parameters, workflow groups, OAuth scopes, error codes, and code examples.
keywords: plane api v2, create state, workflow state, state group, POST states
---

# Create a state

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v2/workspaces/{slug}/projects/{project_id}/states/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Add a workflow state to a project. The new state is appended to the project's workflow and becomes immediately selectable on work items.

State names must be unique within a project — reusing one returns `409 conflict`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string (uuid)" :required="true">

The project to add the state to.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string" :required="true">

Display name for the state, unique within the project. Maximum 255 characters.

</ApiParam>

<ApiParam name="color" type="string" :required="true">

Hex color used wherever the state is rendered, for example `#3f76ff`. Maximum 255 characters.

</ApiParam>

<ApiParam name="group" type="string" :required="false">

The workflow group the state belongs to. Determines how the state is treated by boards, charts, and cycle progress.

- `backlog` — Not yet scheduled
- `unstarted` — Scheduled but not begun
- `started` — Actively in progress
- `completed` — Finished successfully
- `cancelled` — Closed without completion
- `triage` — Awaiting intake review

Defaults to `backlog` when omitted.

</ApiParam>

<ApiParam name="description" type="string" :required="false">

Free-form description of what the state means in this workflow.

</ApiParam>

<ApiParam name="sequence" type="number" :required="false">

Ordering weight within the project. Lower values sort first. Assigned automatically when omitted.

</ApiParam>

<ApiParam name="is_default" type="boolean" :required="false">

Make this the project's default state — where work items land when no `state_id` is supplied. Setting it clears the flag on the previous default.

</ApiParam>

<ApiParam name="external_id" type="string" :required="false">

Your system's identifier for this state, for sync and import correlation. Maximum 255 characters.

</ApiParam>

<ApiParam name="external_source" type="string" :required="false">

The system `external_id` came from, for example `github` or `jira`. Maximum 255 characters.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`projects.states:write`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                      |
| ------ | -------------------- | ---------------------------------------------------------- |
| `400`  | `validation_error`   | Missing `name`/`color`, or a `group` outside the enum.     |
| `403`  | `forbidden`          | Your role or token scope can't create states.              |
| `404`  | `resource_not_found` | No such workspace or project, or it's outside your tenant. |
| `409`  | `conflict`           | A state with this name already exists in the project.      |

</div>

</div>

<div class="api-right">

<CodePanel title="Create a state" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/" \
  -H "X-Api-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "In Review",
  "color": "#3f76ff",
  "group": "started",
  "description": "Awaiting code review"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/",
    headers={"X-Api-Key": "your-api-key"},
    json={
        "name": "In Review",
        "color": "#3f76ff",
        "group": "started",
        "description": "Awaiting code review",
    },
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/",
  {
    method: "POST",
    headers: {
      "X-Api-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "In Review",
      color: "#3f76ff",
      group: "started",
      description: "Awaiting code review",
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
  "id": "b7e42a19-3c5d-4f80-9a26-8d1c0f4e7b53",
  "name": "In Review",
  "description": "Awaiting code review",
  "color": "#3f76ff",
  "group": "started",
  "sequence": 45000,
  "is_default": false,
  "is_triage": false,
  "external_id": null,
  "external_source": null,
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
  "detail": "A state with this name already exists in this project."
}
```

</ResponsePanel>

</div>
</div>
