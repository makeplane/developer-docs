---
title: Overview
description: Plane Release API overview. Learn about endpoints, request/response format, and how to work with releases via REST API.
keywords: plane, plane api, rest api, api integration, releases, release management, versioning
---

# Overview

Releases let you plan, track, and ship versions of your product. A release groups work items, carries a version tag, labels, links, comments, and a changelog, and can be scoped to the whole workspace or to a single project.

[Learn more about Releases](https://docs.plane.so/releases)

Releases are available on paid plans. Requests return `402 Payment Required` when the feature is not enabled for the workspace.

<div class="api-two-column">
<div class="api-left">

## The Release Object

### Attributes

- `id` _uuid_

  Unique identifier for the release

- `name` _string_ **(required)**

  Name of the release. Must be unique within the workspace, otherwise a 400 `RELEASE_NAME_ALREADY_EXISTS` error is returned.

- `description` _object_

  Read-only nested description object with `description_html`, `description_binary`, `description_stripped`, and `description_json`

- `description_html` _string_ (write-only)

  HTML description used to set the release's description on create/update

- `description_json` _object_ (write-only)

  JSON description used to set the release's description on create/update

- `status` _string_

  Status of the release. Can be: `unreleased`, `released`, `cancelled`. Defaults to `unreleased`

- `target_date` _date_

  Target date for the release in YYYY-MM-DD format

- `release_date` _date_

  Actual release date in YYYY-MM-DD format

- `lead` _uuid_

  User ID of the release lead

- `tag` _uuid_

  ID of the release tag associated with the release. Must reference a global tag or a tag belonging to the same project, otherwise a 400 `{"tag": "RELEASE_TAG_OUT_OF_SCOPE"}` error is returned.

- `is_latest` _boolean_

  Whether this is the latest release. Defaults to `false`

- `is_prerelease` _boolean_

  Whether this release is a prerelease. Defaults to `false`

- `project` _uuid_

  ID of the project the release belongs to. `null` for workspace-level releases. Immutable after creation; ignored on update.

- `external_id` _string_

  External ID from an external source

- `external_source` _string_

  External source identifier

- `workspace` _uuid_

  Workspace UUID which is automatically saved

- `created_at` _timestamp_

  The timestamp when the release was created

- `updated_at` _timestamp_

  The timestamp when the release was last updated

- `deleted_at` _timestamp_

  The timestamp when the release was deleted, if applicable

- `created_by` _uuid_

  ID of the user who created the release

- `updated_by` _uuid_

  ID of the user who last updated the release

## Related objects

### Release Tag

- `id` _uuid_
- `version` _string_ **(required)** — must be unique within the workspace or project, otherwise 400 `{"version": "RELEASE_TAG_VERSION_ALREADY_EXISTS"}`
- `description` _string_ — plain text
- `commit_hash` _string_
- `git_tag` _string_
- `project` _uuid_ — `null` for a workspace-wide tag; immutable after creation
- `workspace` _uuid_
- `created_at` _timestamp_
- `updated_at` _timestamp_
- `deleted_at` _timestamp_
- `created_by` _uuid_
- `updated_by` _uuid_

### Release Label

- `id` _uuid_
- `name` _string_ **(required)** — must be unique within the workspace or project, otherwise 400 `{"name": "RELEASE_LABEL_NAME_ALREADY_EXISTS"}`
- `color` _string_ — defaults to `#4E5355`
- `sort_order` _integer_ — defaults to `0`
- `workspace` _uuid_
- `project` _uuid_ — `null` for a workspace-wide label; immutable after creation

### Release Comment

- `id` _uuid_
- `release` _uuid_ (read-only)
- `comment` _object_ — read-only nested description object, same shape as the release's `description`
- `comment_html` _string_ (write-only)
- `parent` _uuid_ — parent comment for threaded replies
- `edited_at` _timestamp_
- `is_resolved` _boolean_ — defaults to `false`
- `is_hidden` _boolean_ (read-only)
- `workspace` _uuid_
- `created_at` _timestamp_
- `updated_at` _timestamp_
- `deleted_at` _timestamp_
- `created_by` _uuid_
- `updated_by` _uuid_

### Release Link

- `id` _uuid_
- `release` _uuid_ (read-only)
- `title` _string_ **(required)**
- `url` _string_ **(required)** — must be a valid URL, unique per release
- `metadata` _object_ — defaults to `{}`
- `workspace` _uuid_
- `created_at` _timestamp_
- `updated_at` _timestamp_
- `deleted_at` _timestamp_
- `created_by` _uuid_
- `updated_by` _uuid_

### Release Changelog

- `id` _uuid_
- `release` _uuid_ (read-only)
- `changelog` _object_ — read-only nested description object, same shape as the release's `description`
- `description_html` _string_ (write-only)
- `description_json` _object_ (write-only)
- `workspace` _uuid_
- `created_at` _timestamp_
- `updated_at` _timestamp_
- `deleted_at` _timestamp_
- `created_by` _uuid_
- `updated_by` _uuid_

</div>
<div class="api-right">

<ResponsePanel status="200" title="THE RELEASE OBJECT">

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2025-03-01T10:00:00.000000Z",
  "updated_at": "2025-03-05T14:30:00.000000Z",
  "deleted_at": null,
  "name": "v2.4.0",
  "description": {
    "description_html": "<p>Spring feature release.</p>",
    "description_binary": null,
    "description_stripped": "Spring feature release.",
    "description_json": {}
  },
  "status": "unreleased",
  "target_date": "2025-03-31",
  "release_date": null,
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
