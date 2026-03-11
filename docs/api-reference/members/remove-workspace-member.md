---
title: Remove workspace member
description: Remove a member from a workspace via Plane API. HTTP POST request to deactivate users across projects and teamspaces.
keywords: plane api, remove member, delete member, workspace members, user management, rest api, api integration
---

# Remove workspace member

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{slug}/members/remove/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Removes a member from a workspace. This deactivates them across all projects, removes them from teamspaces and pages, and optionally reduces seat count.

<div class="params-section">

### Path parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The unique identifier (slug) for the workspace.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="email" type="string" :required="true">

Email address of the member to remove.

</ApiParam>

<ApiParam name="remove_seat" type="boolean" :required="false">

Reduce purchased seat count by 1. Defaults to `false`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `workspaces:members:write`

</div>

<div class="params-section">

### Responses

| Status | Description |
| ------ | ----------- |
| 204 | Member removed successfully (no body) |
| 400 | Validation error (see below) |
| 403 | You are not a member of this workspace |
| 404 | Workspace or member not found |

**400 Validation Errors:**

- `email` field is required.
- Cannot remove yourself. You'll need leave the workspace from the application.
- Cannot remove a member with a higher role than yours.
- Member is the sole admin of one or more projects — promote another admin first.

</div>

<div class="params-section">

### What happens

- Member is deactivated in all projects.
- Member is removed from all teamspaces and shared pages
- If `remove_seat` is `true` and unused seats exist, one seat is removed from your plan.
</div>

</div>
<div class="api-right">

<CodePanel title="Remove workspace member" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/members/remove/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "email": "jane@example.com",
  "remove_seat": true
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/members/remove/",
    headers={"X-API-Key": "your-api-key"},
    json={
        "email": "jane@example.com",
        "remove_seat": True
    }
)
print(response.status_code)  # 204 on success
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/members/remove/",
  {
    method: "POST",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "jane@example.com",
      remove_seat: true,
    }),
  }
);
console.log(response.status); // 204 on success
```

</template>
</CodePanel>

<ResponsePanel status="204">

```json
No Content
```

</ResponsePanel>

</div>
</div>
