---
title: Sparse fieldsets
description: How ?fields= works in Plane API v2. Omit semantics, the all token, list deferral, detail-only fields, and how fields compose with expand.
keywords: plane api v2, fields, sparse fieldsets, omit, all, custom_fields, deferred_on_list, detail_only
---

# Sparse fieldsets

v2 responses are already sparse by design — relations ship as `*_id` / `*_ids`, not nested trees. **`?fields=`** goes further: it lets you return only the keys you need. Unrequested keys are **omitted** from the JSON (they are not set to `null`).

```bash
GET .../work-items/?fields=id,name,state_id
GET .../work-items/?fields=all
GET .../work-items/                                 # default field set for that response shape
```

`?fields=` is declared on every operation whose response body is a core read serializer — list, retrieve, create and update echoes, upsert. Bulk write responses and a few bespoke `APIView`s (for example `users/me`) do not accept it. Allowed names are **enumerated per operation** in the OpenAPI document at `/api/v2/schema/`.

## Omit, not null-out

| Request | Result |
| --- | --- |
| `?fields=id,name` | Body contains only those keys (plus `id` is always forced when the resource declares one) |
| No `?fields=` | Default set for the response shape (see [list deferral](#list-deferral)) |
| `?fields=all` | Every requestable field for that shape |

```bash
curl "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/work-items/?fields=id,name,state_id&per_page=2" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

<ResponsePanel status="200">

```json
{
  "data": [
    {
      "id": "8f4c2b1e-0d3a-4f7b-9c21-6e5a8b7d4f13",
      "name": "Fix login redirect",
      "state_id": "f960d3c2-8524-4a41-b8eb-055ce4be2a7f"
    }
  ],
  "next": null,
  "previous": null,
  "total_count": 1,
  "pagination": { "style": "offset" }
}
```

</ResponsePanel>

Absent means "not requested". `null` still means "this value is null in the database" when the field is included.

## Syntax

- Comma-separated list, same shape as `?expand=`
- Empty segments are dropped (`?fields=id,,name` ≡ `?fields=id,name`)
- Leading/trailing whitespace around a token is ignored
- Token order does not control JSON key order

## The `all` token

`all` is a reserved word in the fields namespace. It means "every requestable field for this response shape".

- On a **collection**, `all` still excludes [detail-only](#detail-only-fields) fields such as work-item `custom_fields`
- On a **detail / write echo**, `all` is the full read shape, including detail-only fields
- Mixing is allowed: `?fields=all,name` is valid — once `all` survives validation, the explicit names are redundant

## List deferral

Some resources omit heavy scalars from **collection** rows by default (HTML blobs and similar). Naming a deferred field in `?fields=` pulls it back; `?fields=all` does the same for every deferred field that is still legal on collections.

Single-object responses (retrieve, create/update echo, upsert) never defer — you get the full requestable set unless you pass `?fields=` yourself.

## Detail-only fields

A small set of fields never appear on collection rows and **cannot be requested there**.

Today the only case in the documented surface is work-item **`custom_fields`**:

| Request | Result |
| --- | --- |
| `GET …/work-items/` | Each row has **no** `custom_fields` key |
| `GET …/work-items/?fields=…,custom_fields` | `400` — not available on collections |
| `GET …/work-items/{pk}/` | `custom_fields` is present (object or empty `{}`) |
| `GET …/work-items/{pk}/?fields=id,custom_fields` | Sparse detail with only those keys |

Retrieve (by UUID or by `PROJ-123` identifier), create, and update are the places to read custom property values.

## Orthogonal to `?expand=`

`?fields=` and `?expand=` are **separate namespaces**:

- Field tokens are response field names (`state_id`, `name`, `assignee_ids`)
- Expand tokens are relation names (`state`, `assignees`, `cycle`)

```bash
GET .../work-items/?fields=id,name&expand=state
# → { "id": "…", "name": "…", "state": { … } }
#    state_id is omitted (not requested); state is added by expand
```

Passing an expand name to `fields` (or a field name to `expand`) is a `400` with a message that points you at the other parameter — it does not auto-expand.

See [Expanding relations](/api-reference/v2/expanding-relations).

## Errors

Unknown field names are a strict `400 validation_error`. The message includes a did-you-mean hint and the valid list for that operation:

<ResponsePanel status="400">

```json
{
  "type": "https://api.plane.so/errors/validation_error",
  "title": "Validation Error",
  "status": 400,
  "code": "validation_error",
  "detail": "One or more fields failed validation.",
  "errors": [
    {
      "field": "fields",
      "message": "Unknown field(s): titel — did you mean 'name'? Valid fields: all, id, name, identifier, …"
    }
  ]
}
```

</ResponsePanel>

Validation order when tokens are mixed:

1. Any token not in the resource's field set and not `all` → `400`
2. On a collection, an explicitly named detail-only field → `400`
3. If `all` remains → full requestable set for that shape

## Addressing by attribute, not by path alias

Detail path segments address by **stable identifiers only**:

| Key | Example | Where |
| --- | --- | --- |
| Workspace slug | `my-team` | Every workspace-scoped path |
| Project UUID or identifier | `4af68566-…` or `ENG` | Project detail and parent `project_id` segments |
| Work item UUID | `8f4c2b1e-…` | Project-scoped detail and writes |
| Work item human key | `PROJ-142` | Workspace-scoped [get by identifier](/api-reference/v2/work-items/get-work-item-by-identifier) and nested parent segments |

There are **no** scheme-prefixed path aliases (`name:…`, `key:…`, `external:…`, and so on). Look up a record by a mutable attribute on the **list** endpoint, then use the id:

```bash
# resolve a state name → id in one cheap call
curl "https://api.plane.so/api/v2/workspaces/my-team/projects/ENG/states/?name=In%20Progress&fields=id,name" \
  -H "X-Api-Key: $PLANE_API_KEY"
```

Exact identity filters (`?name=`, and where present `?external_id=` / `?external_source=`) return zero, one, or many rows — they never invent a single-object 409. Pair them with `?fields=id` when you only need the id for a later write.

## Related

- [Expanding relations](/api-reference/v2/expanding-relations) — `?expand=` beside sparse ids
- [Filtering and ordering](/api-reference/v2/filtering-and-ordering) — identity filters on lists
- [Migrating from v1](/api-reference/v2/migrating-from-v1) — how v1 `?fields=` maps to v2
