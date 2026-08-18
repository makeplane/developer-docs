---
title: Create a wiki page
description: Create a wiki page via Plane API. HTTP request format, parameters, scopes, and example responses for create a wiki page.
keywords: plane, plane api, rest api, api integration, page, create a wiki page
---

# Create a wiki page

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/pages/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Create a workspace page. To create a child page, pass `parent_id`; Plane creates the page and inserts a page embed into
the parent document. The parent must be visible, editable, unlocked, and active.

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

<ApiParam name="name" type="string" :required="true">

Name.

</ApiParam>

<ApiParam name="access" type="integer" :required="false">

- `0` - Public
- `1` - Private

</ApiParam>

<ApiParam name="color" type="string" :required="false">

Color.

</ApiParam>

<ApiParam name="is_locked" type="boolean" :required="false">

Is locked.

</ApiParam>

<ApiParam name="archived_at" type="string" :required="false">

Archived at.

</ApiParam>

<ApiParam name="view_props" type="object" :required="false">

View props.

</ApiParam>

<ApiParam name="logo_props" type="object" :required="false">

Logo props.

</ApiParam>

<ApiParam name="external_id" type="string" :required="false">

External id.

</ApiParam>

<ApiParam name="external_source" type="string" :required="false">

External source.

</ApiParam>

<ApiParam name="description_html" type="string" :required="true">

HTML content for the page body. Plane sanitizes the HTML before storing it.

</ApiParam>

<ApiParam name="parent_id" type="string" :required="false">

UUID of the parent workspace page. Do not combine `parent_id` with `collection_id`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`write` or `wiki.pages:write`

</div>

</div>

<div class="api-right">

<CodePanel title="Create a wiki page" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v1/workspaces/my-workspace/pages/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  # Or use -H "Authorization: Bearer $PLANE_OAUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Example Name",
  "access": 0,
  "color": "Example Name",
  "is_locked": true,
  "archived_at": "2024-01-01",
  "view_props": "example-value",
  "logo_props": "example-value",
  "external_id": "550e8400-e29b-41d4-a716-446655440000",
  "external_source": "github",
  "parent_id": "4d2f6f7e-9b4a-4d6a-8f4a-1c3f7c0f4a10",
  "description_html": "<p>Example content</p>"
}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v1/workspaces/my-workspace/pages/",
    headers={"X-API-Key": "your-api-key"},
    json={
      "name": "Example Name",
      "access": 0,
      "color": "Example Name",
      "is_locked": true,
      "archived_at": "2024-01-01",
      "view_props": "example-value",
      "logo_props": "example-value",
      "external_id": "550e8400-e29b-41d4-a716-446655440000",
      "external_source": "github",
      "parent_id": "4d2f6f7e-9b4a-4d6a-8f4a-1c3f7c0f4a10",
      "description_html": "<p>Example content</p>"
    }
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v1/workspaces/my-workspace/pages/", {
  method: "POST",
  headers: {
    "X-API-Key": "your-api-key",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Example Name",
    access: 0,
    color: "Example Name",
    is_locked: true,
    archived_at: "2024-01-01",
    view_props: "example-value",
    logo_props: "example-value",
    external_id: "550e8400-e29b-41d4-a716-446655440000",
    external_source: "github",
    parent_id: "4d2f6f7e-9b4a-4d6a-8f4a-1c3f7c0f4a10",
    description_html: "<p>Example content</p>",
  }),
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="201">

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Example Name",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "description_html": "<p>Example content</p>",
  "owned_by": "550e8400-e29b-41d4-a716-446655440000",
  "access": 0,
  "color": "Example Name",
  "is_locked": true,
  "archived_at": "2024-01-01",
  "workspace": "550e8400-e29b-41d4-a716-446655440000",
  "created_by": "550e8400-e29b-41d4-a716-446655440000",
  "updated_by": "550e8400-e29b-41d4-a716-446655440000"
}
```

</ResponsePanel>

</div>

</div>

## Child-page responses

- `201 Created`: the child was created and linked in the parent document.
- `202 Accepted`: the child was created, but Plane is still retrying the parent link. Store the returned page ID and
  check the parent later.
- `400 Bad Request`: the parent is locked or archived, or `parent_id` conflicts with `collection_id`.
- `403 Forbidden`: the caller cannot edit the parent.
- `404 Not Found`: the parent is unavailable in this workspace.
- `502 Bad Gateway`: the parent link was rejected and the new child was removed.
- `503 Service Unavailable`: the collaborative document service is not configured.
