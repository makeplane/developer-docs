---
title: Archive a work item
description: Archive a Plane work item with the v2 REST API. Bodyless POST, the archived_at timestamp, visibility of archived items, OAuth scopes, error codes, and code examples.
keywords: plane api v2, archive work item, archived_at, POST archive, hide work item, reversible archive
---

# Archive a work item

<div class="api-endpoint-badge">
  <span class="method post">POST</span>
  <span class="path">/api/v2/workspaces/{slug}/projects/{project_id}/work-items/{pk}/archive/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Archive a work item: stamp `archived_at` with the current time and take it out of the active work item set.

This is a **bodyless** `POST` — send no JSON at all. The response is the full work item in its usual read shape, with
`archived_at` now populated, so you can confirm the change without a follow-up read.

Archiving is reversible with [Unarchive a work item](/api-reference/v2/work-items/unarchive-work-item), and it is
entirely separate from [deleting](/api-reference/v2/work-items/delete-work-item) — an archived work item still exists.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="slug" type="string" :required="true">

The workspace slug. It appears in your Plane URLs — in `https://app.plane.so/my-team/projects/`, the slug is `my-team`.

</ApiParam>

<ApiParam name="project_id" type="string (uuid)" :required="true">

The project the work item belongs to.

</ApiParam>

<ApiParam name="pk" type="string (uuid)" :required="true">

The work item's UUID. This lookup is UUID-only — a `PROJ-142` identifier here returns `404`.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

None. The endpoint takes no request body; anything you send is ignored.

</div>

::: warning Archiving twice returns 404
Once archived, a work item is outside the default query set, so a second `archive` call on the same work item can't
resolve it and returns `404 resource_not_found` — not a `409`, and not a silent success. If you're re-running a job,
treat a `404` here as "already archived" rather than an error worth retrying.
:::

<div class="params-section">

### Scopes

`projects.work_items:write`

</div>

<div class="params-section">

### Errors

| Status | Code                 | Cause                                                                              |
| ------ | -------------------- | ---------------------------------------------------------------------------------- |
| `400`  | `validation_error`   | The request could not be processed — for example a `pk` that isn't a valid UUID.   |
| `401`  | `unauthorized`       | Missing or invalid credentials.                                                    |
| `403`  | `forbidden`          | Your role or token scope can't archive this work item.                             |
| `404`  | `resource_not_found` | No such work item, it's outside your project or tenant, or it is already archived. |
| `409`  | `conflict`           | The write collides with a protected-resource constraint.                           |
| `429`  | `rate_limited`       | Throttled. Honor the `Retry-After` header before retrying.                         |

</div>

</div>

<div class="api-right">

<CodePanel title="Archive a work item" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X POST \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/work-items/8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13/archive/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b"
    "/work-items/8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13/archive/",
    headers={"X-Api-Key": "your-api-key"},
)
print(response.json()["archived_at"])
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b" +
    "/work-items/8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13/archive/",
  {
    method: "POST",
    headers: { "X-Api-Key": "your-api-key" },
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13",
  "name": "Fix login redirect loop",
  "identifier": "PROJ-142",
  "sequence_id": 142,
  "priority": "high",
  "state_id": "f960d3c2-8524-4a41-b8eb-055ce4be2a7f",
  "type_id": "2d9d1a97-5c6f-4a1e-9d5b-8c2f7e30b6a4",
  "assignee_ids": ["16c61a3a-512a-48ac-b0be-b6b46fe6f430"],
  "label_ids": ["c1b8f3d6-9a44-4e12-8f7a-2b6d5c9e1a03"],
  "parent_id": null,
  "start_date": "2026-01-12",
  "target_date": "2026-01-20",
  "is_draft": false,
  "archived_at": "2026-02-03T11:47:19.204518Z",
  "created_at": "2026-01-14T09:22:41.478363Z",
  "created_by_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "custom_fields": null
}
```

</ResponsePanel>

<ResponsePanel status="404">

```json
{
  "type": "https://api.plane.so/errors/resource_not_found",
  "title": "Not Found",
  "status": 404,
  "code": "resource_not_found",
  "detail": "The requested resource was not found."
}
```

</ResponsePanel>

</div>
</div>

## What archiving changes

- `archived_at` goes from `null` to a timestamp. It is the only field the call touches — state, assignees, dates, and
  labels are untouched.
- The work item drops out of [List work items](/api-reference/v2/work-items/list-work-items) and out of plain detail
  reads, including the [identifier route](/api-reference/v2/work-items/get-work-item-by-identifier).
- Nothing is deleted. Comments, links, and relations survive, and
  [unarchiving](/api-reference/v2/work-items/unarchive-work-item) restores the work item exactly as it was.

`archived_at` is read-only on the work item itself, so you cannot archive by `PATCH`ing a timestamp — this endpoint is
the only way in, and unarchive is the only way out.
