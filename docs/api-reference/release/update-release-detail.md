---
title: Update a release
description: Update a release via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Update a release

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/releases/{release_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing workspace-level release by setting the values of the parameters passed. Any parameters not provided will be left unchanged. `name` must remain unique within the workspace, otherwise a 400 `RELEASE_NAME_ALREADY_EXISTS` error is returned. If `tag` is provided, it must reference a global release tag or a tag belonging to the same project, otherwise a 400 `{"tag": "RELEASE_TAG_OUT_OF_SCOPE"}` error is returned. `project` cannot be changed and is ignored if passed.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="release_id" type="string" :required="true">

The unique identifier for the release.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string">

Name of the release.

</ApiParam>

<ApiParam name="description_html" type="string">

HTML description of the release.

</ApiParam>

<ApiParam name="description_json" type="object">

JSON description of the release.

</ApiParam>

<ApiParam name="status" type="string">

Status of the release. Can be: `unreleased`, `released`, `cancelled`.

</ApiParam>

<ApiParam name="target_date" type="string">

Target date of the release in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="release_date" type="string">

Actual release date of the release in YYYY-MM-DD format.

</ApiParam>

<ApiParam name="lead" type="string">

ID of the user who leads the release.

</ApiParam>

<ApiParam name="tag" type="string">

ID of the release tag associated with the release.

</ApiParam>

<ApiParam name="is_latest" type="boolean">

Whether this is the latest release.

</ApiParam>

<ApiParam name="is_prerelease" type="boolean">

Whether this release is a prerelease.

</ApiParam>

<ApiParam name="external_id" type="string">

External ID from an external source.

</ApiParam>

<ApiParam name="external_source" type="string">

External source identifier.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`releases:write`

</div>

</div>
<div class="api-right">

<CodePanel title="Update a release" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "status": "released",
  "release_date": "2025-04-02"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'status': 'released',
  'release_date': '2025-04-02'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/releases/a1b2c3d4-e5f6-7890-abcd-ef1234567890/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "released",
      release_date: "2025-04-02",
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
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2025-03-01T10:00:00.000000Z",
  "updated_at": "2025-04-02T09:00:00.000000Z",
  "deleted_at": null,
  "name": "v2.4.0",
  "description": {
    "description_html": "<p>Spring feature release.</p>",
    "description_binary": null,
    "description_stripped": "Spring feature release.",
    "description_json": {}
  },
  "status": "released",
  "target_date": "2025-03-31",
  "release_date": "2025-04-02",
  "is_latest": false,
  "is_prerelease": false,
  "external_id": null,
  "external_source": null,
  "created_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "updated_by": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "workspace": "cd4ab5a2-1a5f-4516-a6c6-8da1a9fa5be4",
  "lead": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "tag": "9f8e7d6c-5b4a-3210-fedc-ba0987654321",
  "project": null
}
```

</ResponsePanel>

</div>
</div>
