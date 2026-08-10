---
title: Plane API v2
description: Introduction to the Plane REST API v2 — base URL, trailing slashes, PATCH-only writes, sparse reads, RFC 9457 errors, and a quickstart request.
keywords: plane api v2, rest api, plane api introduction, api.plane.so, plane api quickstart, openapi schema, plane developer api
---

# Plane API v2

API v2 is the current, recommended REST interface to Plane. It is resource-oriented, JSON in and JSON out, and
described by a machine-readable OpenAPI document you can generate clients from.

Everything here is stable and actively developed. [API v1](/api-reference/v1/introduction) remains available and
supported for existing integrations, but it is in maintenance — build new integrations on v2.

::: tip Already on v1?
The two versions run side by side, so you can migrate one resource at a time. See
[Migrating from v1](/api-reference/v2/migrating-from-v1) for the field-by-field differences.
:::

## Base URL

| Deployment   | Base URL                                                   |
| ------------ | ---------------------------------------------------------- |
| Plane Cloud  | `https://api.plane.so`                                     |
| Self-managed | Your instance URL, for example `https://plane.example.com` |

Every v2 path lives under `/api/v2/`, and **every URL ends with a trailing slash**. Dropping it is the single most
common first-request mistake — `/api/v2/users/me` is not the same URL as `/api/v2/users/me/`.

The OpenAPI document advertises one `servers` entry that matches your deployment, so a generated client points at the
right host without further configuration.

## Quickstart

`GET /api/v2/users/me/` needs no workspace or project id, which makes it the fastest way to confirm your credentials
work.

<CodePanel title="Verify your credentials" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl "https://api.plane.so/api/v2/users/me/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

</template>
<template #python>

```python
import requests

response = requests.get(
    "https://api.plane.so/api/v2/users/me/",
    headers={"X-Api-Key": "your-api-key"},
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch("https://api.plane.so/api/v2/users/me/", {
  headers: { "X-Api-Key": "your-api-key" },
});
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
  "email": "priya@my-team.io",
  "display_name": "priya",
  "principal_kind": "api_key",
  "scopes": []
}
```

</ResponsePanel>

If that returns `200`, your key is valid. If it returns `401`, the header name or the key itself is wrong — see
[Authentication](/api-reference/v2/authentication).

## Requests

- **JSON only.** Send `Content-Type: application/json` on requests with a body; responses are JSON.
- **`POST` creates, `PATCH` updates.** There is no `PUT` — sending one returns `405 method_not_allowed`.
- **`PATCH` is partial.** Only the fields you send are changed. Omitting a field leaves it untouched, which is not the
  same as sending `null` to clear it.
- **`DELETE` returns `204`** with an empty body. Deletes are soft.
- **Writes take ids, not nested objects.** Set a relation with its `*_id` field (`state_id`, `parent_id`, `lead_id`) or
  its `*_ids` array (`assignee_ids`, `label_ids`). Work items also accept write-only human-readable parallels
  (`state`, `type`, `parent`, `assignees`, `labels`, `estimate`) — see
  [Work items](/api-reference/v2/work-items/overview#writing-send-ids-or-send-names).
- **Sparse responses with `?fields=`.** Ask for only the keys you need; unrequested keys are omitted. See
  [Sparse fieldsets](/api-reference/v2/fields).
- **Audit fields are read-only.** `created_at`, `created_by_id`, and their siblings are set server-side; sending them
  has no effect.

```bash
# Create
curl -X POST \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/" \
  -H "X-Api-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "In Review", "color": "#3f76ff", "group": "started"}'

# Partial update — color changes, nothing else does
curl -X PATCH \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/f960d3c2-8524-4a41-b8eb-055ce4be2a7f/" \
  -H "X-Api-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"color": "#ffffff"}'
```

## Design principles

These five rules hold across every v2 endpoint. Learning them once means you rarely have to re-read a reference page.

### Reads are sparse

A read returns foreign keys as `*_id` fields and many-to-many relations as `*_ids` arrays. No related objects are
embedded by default, so response size stays predictable no matter how many relations a resource has.

```json
{
  "id": "8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13",
  "name": "Fix login redirect",
  "state_id": "f960d3c2-8524-4a41-b8eb-055ce4be2a7f",
  "assignee_ids": ["16c61a3a-512a-48ac-b0be-b6b46fe6f430"]
}
```

Trim further with **`?fields=`** — unrequested keys are omitted from the JSON (not nulled). `?fields=id,name,state_id`
returns only those keys; `?fields=all` returns every requestable field for that response shape. See
[Sparse fieldsets](/api-reference/v2/fields).

### Expansion is separate-key

`?expand=` **adds** an object beside the id — it never replaces it. `?expand=state` gives you `state_id` _and_ a
`state` object, so code that reads `state_id` keeps working whether or not the caller asked for the expansion.

Work items accept `state`, `type`, `parent`, `assignees`, `labels`, `cycle`, and `modules`. Members, cycles, modules,
and several other resources declare their own expand allowlists. See
[Expanding relations](/api-reference/v2/expanding-relations).

### Paths address by stable keys

Detail segments use UUIDs (or the three bare human keys: workspace slug, project identifier, work-item `PROJ-123`).
There are no scheme-prefixed path aliases (`name:…`, `key:…`, `external:…`). Resolve a mutable attribute — a state
name, a label name, an external id — with a **list** filter such as `?name=` or `?external_id=`, optionally paired with
`?fields=id`. Parent `project_id` segments accept the project UUID **or** its bare identifier (`ENG`).

### Errors are RFC 9457

Every failure is `application/problem+json` with a stable machine-readable `code`. Branch on `code`, never on the HTTP
status or the human-readable `detail`. See [Errors](/api-reference/v2/errors).

### Cross-tenant ids return 404

A workspace, project, or record id that belongs to someone else returns `404 resource_not_found`, never `403`. The API
does not distinguish "does not exist" from "exists but is not yours", so it never leaks the existence of a resource you
cannot see.

::: warning A `404` is not always a typo
If a `404` surprises you on an id you are confident is real, check which workspace or project the id belongs to before
checking your spelling.
:::

### v2 evolves additively

Inside `v2` the contract only grows: new optional fields, new enum values, new endpoints. Removals and renames are
reserved for a future major version. Write clients that ignore unknown response fields and tolerate unrecognized enum
values, and upgrades stay uneventful.

## What's in v2

88 operations across these resources.

| Resource                                | Base path                                                                | Reference                                                          |
| --------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Work items                              | `/api/v2/workspaces/{slug}/projects/{project_id}/work-items/`            | [Overview](/api-reference/v2/work-items/overview)                  |
| Work item comments                      | `…/work-items/{work_item_id}/comments/`                                  | [Overview](/api-reference/v2/work-item-comments/overview)          |
| States                                  | `…/projects/{project_id}/states/`                                        | [Overview](/api-reference/v2/states/overview)                      |
| Labels                                  | `…/projects/{project_id}/labels/`                                        | [Overview](/api-reference/v2/labels/overview)                      |
| Cycles                                  | `…/projects/{project_id}/cycles/`                                        | [Overview](/api-reference/v2/cycles/overview)                      |
| Modules                                 | `…/projects/{project_id}/modules/`                                       | [Overview](/api-reference/v2/modules/overview)                     |
| Work item types & properties, project   | `…/projects/{project_id}/work-item-types/`, `…/work-item-properties/`    | [Overview](/api-reference/v2/work-item-types/overview)             |
| Work item types & properties, workspace | `/api/v2/workspaces/{slug}/work-item-types/`, `…/work-item-properties/`  | [Overview](/api-reference/v2/workspace-work-item-types/overview)   |
| Work item property contexts             | `/api/v2/workspaces/{slug}/work-item-properties/{property_id}/contexts/` | [Overview](/api-reference/v2/work-item-property-contexts/overview) |
| Members                                 | `/api/v2/workspaces/{slug}/members/`, `…/projects/{project_id}/members/` | [Overview](/api-reference/v2/members/overview)                     |
| Workspace features                      | `/api/v2/workspaces/{slug}/features/`                                    | [Overview](/api-reference/v2/workspace-features/overview)          |
| Audit logs                              | `/api/v2/workspaces/{slug}/audit-logs/`                                  | [Overview](/api-reference/v2/audit-logs/overview)                  |
| Users                                   | `/api/v2/users/me/`                                                      | [Overview](/api-reference/v2/users/overview)                       |

::: info Two surfaces for work item types
A workspace manages work item types either at the project level or at the workspace level — never both at once. Writing
to the wrong surface returns a `409`. See [Work item type modes](/api-reference/v2/work-item-type-modes).
:::

## Machine-readable schema

The full OpenAPI document is served live at:

```
GET /api/v2/schema/
```

Point a generator at it to produce a typed client, or diff it between releases to see exactly what changed. It is the
authority for every field, enum, and scope in this reference.

## Where to go next

- [Authentication](/api-reference/v2/authentication) — API keys, OAuth 2.0, and the scope model.
- [Pagination](/api-reference/v2/pagination) — offset by default, cursor for deep traversal.
- [Filtering and ordering](/api-reference/v2/filtering-and-ordering) — query parameters on list endpoints.
- [Sparse fieldsets](/api-reference/v2/fields) — `?fields=` omit semantics and list deferral.
- [Expanding relations](/api-reference/v2/expanding-relations) — where `?expand=` works and what it accepts.
- [Errors](/api-reference/v2/errors) — the RFC 9457 problem shape and the full code table.
- [Migrating from v1](/api-reference/v2/migrating-from-v1) — what changed and how to move.
