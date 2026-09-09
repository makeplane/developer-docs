---
title: Update a release tag
description: Update a release tag via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Update a release tag

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/tags/{tag_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing release tag by setting the values of the parameters passed. Any parameters not provided will be left unchanged. `project` is immutable after creation and cannot be changed here.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="tag_id" type="string" :required="true">

The unique identifier for the release tag.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="version" type="string">

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

</div>
</div>

<div class="params-section">

### Scopes

`releases.tags:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Update a release tag" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "commit_hash": "a3f9c1d8e7b6054321fedcba9876543210abcd1",
  "git_tag": "v2.4.0"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'commit_hash': 'a3f9c1d8e7b6054321fedcba9876543210abcd1',
  'git_tag': 'v2.4.0'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/releases/tags/tag-uuid/", {
  method: "PATCH",
  headers: {
    "X-API-Key": "your-api-key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    commit_hash: "a3f9c1d8e7b6054321fedcba9876543210abcd1",
    git_tag: "v2.4.0",
  }),
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
  "created_at": "2025-03-01T10:00:00.000000Z",
  "updated_at": "2025-03-06T08:45:00.000000Z",
  "deleted_at": null,
  "version": "2.4.0",
  "description": "Spring release tag",
  "commit_hash": "a3f9c1d8e7b6054321fedcba9876543210abcd1",
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
