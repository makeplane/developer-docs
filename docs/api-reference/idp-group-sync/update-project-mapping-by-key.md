---
title: Update project group mapping by key
description: Update a project group mapping by project identifier and IdP group name via Plane API. HTTP request format, parameters, scopes, and example responses.
keywords: plane, plane api, rest api, api integration, idp group sync, update project group mapping by key
---

# Update project group mapping by key

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/group-sync/project-mappings/{project_key}/{idp_group_name}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Update an existing IdP group → project mapping addressed by its project identifier and IdP group name instead of the mapping ID. Because a project can have multiple mappings (one per IdP group), both keys are required to identify the target. Supports partial updates.

Only project-scoped mappings can be addressed this way. Mappings with `all_projects: true` have no project identifier — update those by mapping ID with [Update project group mapping](/api-reference/idp-group-sync/update-project-mapping).

Returns `404` when no project with the given identifier exists or the project has no mapping for the given IdP group name. An empty request body returns `400` with `{"error": "Request body cannot be empty."}`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="project_key" type="string" :required="true">

The project identifier (e.g. `ENG`). Case-insensitive — the value is matched against the uppercase project identifier.

</ApiParam>

<ApiParam name="idp_group_name" type="string" :required="true">

The name of the IdP group the mapping belongs to. Matched exactly.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="idp_group_name" type="string" :required="false">

The name of the IdP group to map.

</ApiParam>

<ApiParam name="role" type="string" :required="false">

Project role slug to assign to members of the IdP group (e.g. `member`, `admin`, `guest`).

</ApiParam>

<ApiParam name="project" type="string" :required="false">

Project identifier to map the group to (e.g. `ENG`). Mutually exclusive with `all_projects`.

</ApiParam>

<ApiParam name="all_projects" type="boolean" :required="false">

When `true`, maps the group to all projects in the workspace. Mutually exclusive with `project`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`workspaces.group_sync:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Update project group mapping by key" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/group-sync/project-mappings/ENG/engineering/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "role": "admin"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/group-sync/project-mappings/ENG/engineering/",
    headers={"X-API-Key": "your-api-key"},
    json={"role": "admin"}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/group-sync/project-mappings/ENG/engineering/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: "admin" }),
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "661f9511-f30c-52e5-b827-557766551111",
  "idp_group_name": "engineering",
  "project": "ENG",
  "all_projects": false,
  "role": "admin",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>

</div>
