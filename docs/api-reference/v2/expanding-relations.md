---
title: Expanding relations
description: How ?expand= works in Plane API v2. Sparse reads, the separate-key expansion contract, which resources support expansion, and the exact shape of each expanded object.
keywords: plane api v2, expand, sparse fields, state_id, assignee_ids, embedded relations, expand state, expand assignees, expand member, expand cycle
---

# Expanding relations

v2 reads are **sparse by default**. A response gives you scalars plus identifiers for everything related to it — never an embedded object tree:

- A to-one relation comes back as **`<name>_id`**: `state_id`, `type_id`, `parent_id`, `created_by_id`, `cycle_id`.
- A to-many relation comes back as **`<name>_ids`**, an array: `assignee_ids`, `label_ids`, `module_ids`.

`?expand=` opts a single request into richer output for specific relations. It takes a comma-separated list:

```bash
GET .../work-items/?expand=state,assignees,cycle
```

Allowed values are **enumerated per operation** in the OpenAPI document. Unknown names are a `400`.

## Expansion is separate-key

This is the part that trips people up, so it is worth stating flatly:

::: warning `?expand=` adds a key. It never replaces one.
`?expand=state` keeps `state_id` exactly where it was **and** adds a separate `state` object beside it. The identifier is not swapped for an object, and it does not disappear. Both are present in the same response (unless you also pass `?fields=` and omit the id — see below).
:::

Most APIs that offer expansion do the opposite — the `state` key holds a UUID string when you do not expand and an object when you do. That design forces every consumer to write `typeof x === "string" ? x : x.id` at each use site, and it means the shape of your response depends on a query parameter that some other part of your codebase set.

v2 splits the two concerns into two keys with two stable types:

| Key        | Type            | Present when                                      |
| ---------- | --------------- | ------------------------------------------------- |
| `state_id` | `string (uuid)` | By default; omit only via explicit `?fields=`     |
| `state`    | object          | Only with `?expand=state`                         |

### Why this matters for your client

- **One type per field, forever.** `state_id` is a `string` in every response your code will ever see. You never union a string with an object, and you never write a type guard to tell them apart.
- **Expansion is additive, so it is safe to change.** A caller can add or drop `?expand=` without invalidating any code that reads `state_id`. Your identifier-keyed caches, join tables, and foreign keys keep working untouched.
- **Optional, not conditional.** In a typed client, the expanded key is simply optional — `state?: State`. Compare that with a discriminated union of `string | State`, which every consumer has to narrow.
- **Nothing to reconcile.** Because both keys are present by default, `item.state.id` and `item.state_id` never disagree.

The practical rule: **read identifiers from `*_id` / `*_ids`, and treat expanded objects purely as a display convenience** that saves you a round trip.

## Orthogonal to `?fields=`

`?fields=` and `?expand=` are separate namespaces. Expand object keys are not field tokens:

```bash
GET .../work-items/?fields=id,name&expand=state
# → { "id": "…", "name": "…", "state": { … } }
```

`state_id` is omitted because it was not requested; `state` is still added by expand. See [Sparse fieldsets](/api-reference/v2/fields).

## Where `?expand=` is supported

Every expandable resource declares an allowlist. The table covers the resources in this reference; other v2 resources that appear in the OpenAPI document follow the same contract (their expand enums are listed on each operation).

| Resource                                      | Allowed `expand` values                                              |
| --------------------------------------------- | -------------------------------------------------------------------- |
| **Work items**                                | `state`, `type`, `parent`, `assignees`, `labels`, `cycle`, `modules` |
| **Work item comments**                        | `actor`                                                              |
| **Workspace members** and **project members** | `member`                                                             |
| **Cycles**                                    | `owned_by`                                                           |
| **Modules**                                   | `lead`, `members`                                                    |

Passing a value the resource does not declare returns a `400`:

<ResponsePanel status="400">

```json
{
  "type": "https://api.plane.so/errors/validation_error",
  "title": "Validation Error",
  "status": 400,
  "code": "validation_error",
  "detail": "One or more fields failed validation.",
  "errors": [{ "field": "expand", "message": "Unknown expand value(s): project. Valid expands: assignees, cycle, labels, modules, parent, state, type" }]
}
```

</ResponsePanel>

The OpenAPI document at `/api/v2/schema/` lists the exact enum for each operation, including write echoes that accept expand on the response.

## Before and after

Take the same work item list, once sparse and once expanded.

**Sparse (default)**

```bash
curl "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/work-items/" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

<ResponsePanel status="200">

```json
{
  "data": [
    {
      "id": "8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13",
      "name": "Fix login redirect",
      "identifier": "PROJ-118",
      "sequence_id": 118,
      "priority": "high",
      "project_id": "4af68566-94a4-4eb3-94aa-50dc9427067b",
      "state_id": "f960d3c2-8524-4a41-b8eb-055ce4be2a7f",
      "type_id": null,
      "assignee_ids": ["16c61a3a-512a-48ac-b0be-b6b46fe6f430"],
      "label_ids": [],
      "cycle_id": null,
      "module_ids": [],
      "parent_id": null,
      "start_date": null,
      "target_date": "2026-02-02",
      "is_draft": false,
      "archived_at": null,
      "created_at": "2026-01-14T09:22:41.478363Z",
      "created_by_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430"
    }
  ],
  "next": null,
  "previous": null,
  "total_count": 1,
  "pagination": { "style": "offset" }
}
```

</ResponsePanel>

::: info No `custom_fields` on list rows
Work-item `custom_fields` is **detail-only**: the key is absent on collection rows (not `null`). Request it on retrieve. See [Sparse fieldsets](/api-reference/v2/fields#detail-only-fields).
:::

**Expanded**

```bash
curl "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/work-items/?expand=state,assignees" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

<ResponsePanel status="200">

```json
{
  "data": [
    {
      "id": "8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13",
      "name": "Fix login redirect",
      "identifier": "PROJ-118",
      "sequence_id": 118,
      "priority": "high",
      "project_id": "4af68566-94a4-4eb3-94aa-50dc9427067b",
      "state_id": "f960d3c2-8524-4a41-b8eb-055ce4be2a7f",
      "type_id": null,
      "assignee_ids": ["16c61a3a-512a-48ac-b0be-b6b46fe6f430"],
      "label_ids": [],
      "cycle_id": null,
      "module_ids": [],
      "parent_id": null,
      "start_date": null,
      "target_date": "2026-02-02",
      "is_draft": false,
      "archived_at": null,
      "created_at": "2026-01-14T09:22:41.478363Z",
      "created_by_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
      "state": {
        "id": "f960d3c2-8524-4a41-b8eb-055ce4be2a7f",
        "name": "In Progress",
        "color": "#3f76ff",
        "group": "started"
      },
      "assignees": [
        {
          "id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
          "display_name": "Priya Raghavan",
          "avatar_url": "https://assets.plane.so/avatars/16c61a3a.png",
          "email": "priya@example.com"
        }
      ]
    }
  ],
  "next": null,
  "previous": null,
  "total_count": 1,
  "pagination": { "style": "offset" }
}
```

</ResponsePanel>

Note what did **not** change: `state_id` is still `"f960d3c2-…"` and `assignee_ids` is still `["16c61a3a-…"]`. The two new keys sit alongside them.

## Shape of each expanded object

Expanded objects are deliberately minimal projections — enough to render a row without a second request, and nothing more. They are leaves: an expanded object never carries its own expansions or nested relations.

### Work items

| `expand` value | Adds key    | Shape                                                |
| -------------- | ----------- | ---------------------------------------------------- |
| `state`        | `state`     | `id`, `name`, `color`, `group`                       |
| `type`         | `type`      | `id`, `name`, `logo_props`, `is_epic`                |
| `parent`       | `parent`    | `id`, `name`, `sequence_id`                          |
| `assignees`    | `assignees` | Array of `id`, `display_name`, `avatar_url`, `email` |
| `labels`       | `labels`    | Array of `id`, `name`, `color`                       |
| `cycle`        | `cycle`     | `id`, `name` (or `null` when the item has no cycle)  |
| `modules`      | `modules`   | Array of `id`, `name`                                |

### Work item comments

| `expand` value | Adds key | Shape                                       |
| -------------- | -------- | ------------------------------------------- |
| `actor`        | `actor`  | `id`, `display_name`, `avatar_url`, `email` |

### Members

| `expand` value | Adds key | Shape                                       |
| -------------- | -------- | ------------------------------------------- |
| `member`       | `member` | `id`, `display_name`, `avatar_url`, `email` |

```bash
curl "https://api.plane.so/api/v2/workspaces/my-team/members/?expand=member" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

<ResponsePanel status="200">

```json
{
  "data": [
    {
      "id": "c1b7e4a9-2f66-4a1d-9c3b-7d5e2f8a1b40",
      "member_id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
      "role": "admin",
      "member": {
        "id": "16c61a3a-512a-48ac-b0be-b6b46fe6f430",
        "display_name": "Priya Raghavan",
        "avatar_url": "https://assets.plane.so/avatars/16c61a3a.png",
        "email": "priya@example.com"
      }
    }
  ],
  "next": null,
  "previous": null,
  "total_count": 1,
  "pagination": { "style": "offset" }
}
```

</ResponsePanel>

Here too the identifier survives: `member_id` is the user's id, and `member` is the object.

### Cycles and modules

| Resource | `expand` value | Adds key   | Shape                                                |
| -------- | -------------- | ---------- | ---------------------------------------------------- |
| Cycles   | `owned_by`     | `owned_by` | `id`, `display_name`, `avatar_url`, `email`          |
| Modules  | `lead`         | `lead`     | `id`, `display_name`, `avatar_url`, `email`          |
| Modules  | `members`      | `members`  | Array of `id`, `display_name`, `avatar_url`, `email` |

## Behavior notes

- **A to-many expansion is always an array, never `null`.** With `?expand=assignees`, an unassigned work item gets `"assignees": []`.
- **A to-one expansion follows its id.** If `parent_id` is `null`, `?expand=parent` produces `"parent": null`. Same for `cycle` when `cycle_id` is null.
- **Expansion works on detail routes and write echoes too**, not only lists — `GET .../work-items/{pk}/?expand=state,labels` and create/update responses behave the same way.
- **Expanding a list does not cost a query per row.** The relations are loaded in bulk, so `?expand=assignees` on a 200-row page is a small fixed set of additional queries, not 200.
- **Expansion is read-only.** Writes always take ids (`state_id`, `assignee_ids`) or the work-item write-only human parallels; sending a nested object on a `POST` or `PATCH` does not create or link anything.

## Related

- [Sparse fieldsets](/api-reference/v2/fields) — trim keys with `?fields=`
- [Filtering and ordering](/api-reference/v2/filtering-and-ordering) — filter on the same relations with `state_id`, `assignee_id`, and friends
- [Pagination](/api-reference/v2/pagination) — the envelope that wraps every expanded list
- [Migrating from v1](/api-reference/v2/migrating-from-v1) — what to do about v1 responses that embedded these objects by default
