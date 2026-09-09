---
title: Create a release tag
description: Create a release tag via Plane API. HTTP POST request format, required fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Create a release tag

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/tags/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Creates a new release tag in a workspace. `version` must be unique per workspace; if `project` is set, it must be unique per project. Duplicate versions return a 400 with code `RELEASE_TAG_VERSION_ALREADY_EXISTS`.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="version" type="string" :required="true">

Version string for the release tag, for example `2.4.0`.

</ApiParam>

<ApiParam name="description" type="string">

Plain text description of the release tag.

</ApiParam>

<ApiParam name="commit_hash" type="string">

Commit hash the release tag points to.

</ApiParam>

<ApiParam name="git_tag" type="string">

Name of the corresponding git tag, for example `v2.4.0`.

</ApiParam>

<ApiParam name="project" type="string">

ID of the project to scope this release tag to. When omitted, the release tag is workspace-wide.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases.tags:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Create a release tag" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "version": "2.4.0",
  "description": "Spring release tag",
  "commit_hash": "9fceb02d0ae598e95dc970b74767f19372d61af8",
  "git_tag": "v2.4.0"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'version': '2.4.0',
  'description': 'Spring release tag',
  'commit_hash': '9fceb02d0ae598e95dc970b74767f19372d61af8',
  'git_tag': 'v2.4.0'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/", {
  method: "POST",
  headers: {
    "X-API-Key": "your-api-key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    version: "2.4.0",
    description: "Spring release tag",
    commit_hash: "9fceb02d0ae598e95dc970b74767f19372d61af8",
    git_tag: "v2.4.0",
  }),
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
  "created_at": "2025-03-01T10:00:00.000000Z",
  "updated_at": "2025-03-01T10:00:00.000000Z",
  "deleted_at": null,
  "version": "2.4.0",
  "description": "Spring release tag",
  "commit_hash": "9fceb02d0ae598e95dc970b74767f19372d61af8",
  "git_tag": "v2.4.0",
  "created_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "updated_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "project": null
}
```

</ResponsePanel>

</div>
</div>
