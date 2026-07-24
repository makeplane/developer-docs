---
title: Get a workspace work item property
description: Retrieve one workspace-level custom property with the Plane v2 REST API. Path parameters, OAuth scopes, error codes, and code examples.
keywords: plane api v2, get work item property, workspace custom property, GET property by id, property_type
---

# Get a workspace work item property

<div class="api-endpoint-badge">
  <span class="method get">GET</span>
  <span class="path">/api/v2/workspaces/{slug}/work-item-properties/{pk}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Retrieve a single workspace property by id. Use it to read a property's full configuration — its
`property_type`, whether it is required or multi-valued, and the `options` behind an `OPTION` property —
before rendering a field or before sending a `PATCH`.

Reads are unaffected by the workspace's
[work item type mode](/api-reference/v2/work-item-type-modes). A property outside your tenant returns `404`,
never `403` — existence is never leaked.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is
`my-team`.

</ApiParam>

<ApiParam name="pk" type="string (uuid)" :required="true">

The property's id.

</ApiParam>

</div>
</div>

<div class="params-section">

### Scopes

`workspaces.work_item_properties:read`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                               |
| ------ | -------------------- | ------------------------------------------------------------------- |
| `401`  | `unauthorized`       | Missing or invalid credentials.                                     |
| `403`  | `forbidden`          | Your role or token scope can't read workspace work item properties. |
| `404`  | `resource_not_found` | No such workspace or property, or it's outside your tenant.         |
| `429`  | `rate_limited`       | Throttled. Honor the `Retry-After` header before retrying.          |

</div>

</div>

<div class="api-right">

<CodePanel title="Get a workspace property" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X GET \
  "https://api.plane.so/api/v2/workspaces/my-team/work-item-properties/a7e3f1d0-5c92-4b68-8f31-2d4a6b9e0c15/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v2/workspaces/my-team/work-item-properties/a7e3f1d0-5c92-4b68-8f31-2d4a6b9e0c15/",
    headers={"X-Api-Key": "your-api-key"},
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/work-item-properties/a7e3f1d0-5c92-4b68-8f31-2d4a6b9e0c15/",
  {
    headers: {
      "X-Api-Key": "your-api-key",
    },
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "a7e3f1d0-5c92-4b68-8f31-2d4a6b9e0c15",
  "name": "severity",
  "display_name": "Severity",
  "description": "How badly the customer is affected",
  "property_type": "OPTION",
  "relation_type": null,
  "is_required": true,
  "is_multi": false,
  "is_active": true,
  "default_value": ["Major"],
  "options": [
    {
      "id": "9d2c7b41-6a80-4f35-8e19-5c3b0a7d2e46",
      "name": "Critical",
      "description": "Production is down",
      "is_default": false,
      "sort_order": 10000,
      "external_id": null,
      "external_source": null
    },
    {
      "id": "5a83e0b7-2c46-4d19-9f70-6b12c8e5a03d",
      "name": "Major",
      "description": "A core workflow is broken",
      "is_default": true,
      "sort_order": 20000,
      "external_id": null,
      "external_source": null
    }
  ],
  "settings": {},
  "validation_rules": {},
  "logo_props": {},
  "external_id": null,
  "external_source": null,
  "created_at": "2026-01-14T09:22:41.478363Z"
}
```

</ResponsePanel>

<ResponsePanel status="404">

```json
{
  "type": "https://api.plane.so/errors/resource-not-found",
  "title": "Not Found",
  "status": 404,
  "code": "resource_not_found",
  "detail": "No work item property with this id exists in this workspace."
}
```

</ResponsePanel>

</div>
</div>

::: info This says nothing about where the property applies
The property object does not carry its scoping. To find out which projects and work item types see it, list
its contexts with
[List property contexts](/api-reference/v2/work-item-property-contexts/list-property-contexts). A property with
no contexts is defined but not applied anywhere.
:::
