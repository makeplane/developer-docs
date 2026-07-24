---
title: Errors
description: The Plane API v2 error model — RFC 9457 problem+json responses, the full error code table, validation error arrays, rate limiting, and mode conflicts.
keywords: plane api v2 errors, rfc 9457, problem json, validation_error, resource_not_found, rate_limited, retry-after, plane api error codes
---

# Errors

Every v2 error is an [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457) problem document, served as
`application/problem+json`. The shape is the same whether the failure is a typo in a request body or a throttled
client, so one error handler covers the whole API.

## The problem shape

<div class="api-two-column">
<div class="api-left">

### Fields

- `type` _string (uri)_

  A URI identifying the error class, for example `https://api.plane.so/errors/validation_error`. Stable, but meant for
  humans following the link — do not parse it.

- `title` _string_

  A short human-readable summary of the error class, the same for every occurrence.

- `status` _integer_

  The HTTP status code, repeated in the body so a logged payload is self-contained.

- `code` _string_

  **The stable machine-readable identifier.** This is the field to branch on.

- `detail` _string_

  A human-readable explanation of this specific occurrence. Written for a developer reading a log — the wording can
  change between releases.

- `errors` _array_

  Present **only** on `validation_error`. One entry per rejected field, each with a `field` and a `message`.

::: warning Branch on `code`, not on status or prose
Two different failures share status `403` (`forbidden` and `workflow_transition_denied`) and three share `400`. The
HTTP status alone cannot tell them apart.

`detail` is written for people and its wording is not part of the contract. Matching on its text will break.
:::

</div>
<div class="api-right">

<ResponsePanel status="400" title="A VALIDATION ERROR">

```json
{
  "type": "https://api.plane.so/errors/validation_error",
  "title": "Validation Error",
  "status": 400,
  "code": "validation_error",
  "detail": "One or more fields failed validation.",
  "errors": [
    { "field": "name", "message": "This field is required." },
    { "field": "group", "message": "\"in_review\" is not a valid choice." }
  ]
}
```

</ResponsePanel>

<ResponsePanel status="404" title="A NON-VALIDATION ERROR">

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

## Handling errors

Read `code` first. Fall back to `status` only for codes you do not recognize yet — new codes can appear as v2 grows.

<CodePanel title="Branch on the error code" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
# -s keeps curl quiet, -w prints the status so you can see both parts
curl -s -w "\n%{http_code}\n" \
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/" \
  -H "X-Api-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"color": "#3f76ff"}'
```

</template>
<template #python>

```python
import requests

response = requests.post(
    "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/",
    headers={"X-Api-Key": "your-api-key"},
    json={"color": "#3f76ff"},
)

if not response.ok:
    problem = response.json()
    if problem["code"] == "validation_error":
        for item in problem["errors"]:
            print(f"{item['field']}: {item['message']}")
    elif problem["code"] == "rate_limited":
        retry_after = int(response.headers.get("Retry-After", "1"))
        print(f"Throttled, retry in {retry_after}s")
    else:
        print(problem["code"], problem["detail"])
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v2/workspaces/my-team/projects/4af68566-94a4-4eb3-94aa-50dc9427067b/states/",
  {
    method: "POST",
    headers: {
      "X-Api-Key": "your-api-key",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ color: "#3f76ff" }),
  }
);

if (!response.ok) {
  const problem = await response.json();
  switch (problem.code) {
    case "validation_error":
      problem.errors.forEach((e) => console.error(`${e.field}: ${e.message}`));
      break;
    case "rate_limited":
      console.error(`Throttled, retry in ${response.headers.get("Retry-After")}s`);
      break;
    default:
      console.error(problem.code, problem.detail);
  }
}
```

</template>
</CodePanel>

## Error codes

| Status | Code                                   | Meaning                                                                     |
| ------ | -------------------------------------- | --------------------------------------------------------------------------- |
| `400`  | `validation_error`                     | Malformed or invalid body or query parameter. Includes an `errors[]` array. |
| `401`  | `unauthorized`                         | Missing or invalid credentials.                                             |
| `403`  | `forbidden`                            | Authenticated, but your role or token scope can't do this.                  |
| `403`  | `workflow_transition_denied`           | A workflow rule blocked the create or state transition.                     |
| `404`  | `resource_not_found`                   | No such resource, or it's outside your tenant.                              |
| `405`  | `method_not_allowed`                   | Method not supported on this route — most often a `PUT`.                    |
| `409`  | `conflict`                             | Uniqueness or protected-state conflict.                                     |
| `409`  | `work_item_types_managed_at_workspace` | Wrong mode — this workspace manages work item types at the workspace level. |
| `409`  | `work_item_types_managed_at_project`   | Wrong mode — this workspace manages work item types at the project level.   |
| `429`  | `rate_limited`                         | Throttled. Honor the `Retry-After` header.                                  |

Two more `400` codes come from pagination:

| Status | Code                           | Meaning                                                                  |
| ------ | ------------------------------ | ------------------------------------------------------------------------ |
| `400`  | `count_pagination_disabled`    | Offset and COUNT are disabled for this resource. Use `?paginate=cursor`. |
| `400`  | `ordering_not_cursor_eligible` | This ordering can't be combined with cursor pagination. Use offset.      |

An unexpected server-side failure returns `500` with code `internal_error`. Retry it; if it persists, it is not
something your request can fix.

## Validation failures

A `400 validation_error` is the only code that carries `errors[]`. Each entry names one rejected field, and a single
response can carry several — the API validates the whole payload rather than stopping at the first problem, so one
round trip tells you everything to fix.

Query parameters are validated too. Enum-backed parameters such as `priority`, `state_group`, state `group`, and module
`status` are checked against their allowed values, so a typo returns a clean `400` rather than a silently empty list.

::: tip Surface `field` and `message` verbatim
When you are relaying an error to a human — a CLI, a form, a Slack notification — the `field`/`message` pairs are
already specific enough to act on. Passing them through beats collapsing them into "invalid request".
:::

## Rate limiting

Requests are throttled per token, with a separate bucket per token class — API keys, OAuth tokens, workspace tokens,
service tokens, and external tokens. Exceeding a bucket returns `429 rate_limited` with a `Retry-After` header.

<ResponsePanel status="429">

```json
{
  "type": "https://api.plane.so/errors/rate_limited",
  "title": "Rate Limited",
  "status": 429,
  "code": "rate_limited",
  "detail": "Rate limit exceeded."
}
```

</ResponsePanel>

Wait the number of seconds in `Retry-After` before retrying. Backing off on a fixed schedule instead — or retrying
immediately — keeps you in the throttle. Because the buckets are per token, splitting a bulk job across several tokens
does not merge their limits, but it does multiply the load on the workspace.

## Mode conflicts

A workspace manages work item types in exactly one mode: at the **project** level or at the **workspace** level. Both
sets of endpoints exist at all times, so writing to the surface that is not currently in use returns `409` — not `404`
or `403`. The capability is real, it just lives on the other surface.

- Writing to a **project-mode** endpoint while workspace mode is on → `work_item_types_managed_at_workspace`.
- Writing to a **workspace-mode** endpoint while project mode is on → `work_item_types_managed_at_project`.

::: info Reads are never blocked by mode
Only writes conflict. You can list and read types and properties on either surface regardless of the active mode — a
project still surfaces its imported types while the workspace is in workspace mode.
:::

The code tells you where to send the write. See
[Work item type modes](/api-reference/v2/work-item-type-modes) for the full picture.

## Pagination errors

Both pagination `400`s mean the same thing: the pagination style and the request do not fit together.

- `ordering_not_cursor_eligible` — some orderings sort by meaning rather than by a stored column, for example
  `?order_by=priority`. Those cannot back a keyset cursor. Drop `?paginate=cursor` and use offset for that ordering.
- `count_pagination_disabled` — offset with a COUNT is unavailable for this resource. Switch to `?paginate=cursor`.

See [Pagination](/api-reference/v2/pagination) for the two envelopes and when to prefer each.

## Related

- [Authentication](/api-reference/v2/authentication) — what separates `401`, `403`, and a tenant-safe `404`.
- [Pagination](/api-reference/v2/pagination) — offset and cursor styles.
- [Introduction](/api-reference/v2/introduction) — request conventions, including why a missing trailing slash bites.
