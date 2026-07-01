---
title: MCP Server Tool Reference
description: Complete reference for all tools exposed by the Plane MCP Server — work items, projects, cycles, modules, worklogs, epics, milestones, and more.
keywords: plane mcp server, mcp tools, plane api tools, work items mcp, projects mcp, cycles mcp, mcp tool reference
---

# MCP Server Tool Reference

The Plane MCP Server exposes 100+ tools across 20 modules. All tools are available regardless of transport mode — stdio, HTTP/OAuth, HTTP/PAT, and SSE expose the same set.

For setup and client configuration, see the [MCP Server setup guide](/dev-tools/mcp-server).

---

### Users

#### `get_me`

Returns the profile of the currently authenticated user. No parameters.

---

### Workspaces

#### `get_workspace_members`

Returns all members of the workspace.

#### `get_workspace_features`

Returns enabled features for the workspace.

#### `update_workspace_features`

Updates workspace-level feature flags.

---

### Projects

#### `list_projects`

Returns all projects the current user is a member of.

#### `create_project`

Creates a new project.

| Parameter     | Type   | Required | Description                                      |
| ------------- | ------ | -------- | ------------------------------------------------ |
| `name`        | string | **Yes**  | Project display name                             |
| `identifier`  | string | **Yes**  | Short uppercase code, max 12 chars (e.g., `ENG`) |
| `description` | string | No       | Project description                              |
| `network`     | string | No       | `0` (secret) or `2` (public)                     |

#### `retrieve_project`

Returns details of a single project.

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `update_project`

Updates project fields. All fields are optional.

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |
| other fields | partial     | No       |

#### `delete_project`

Deletes a project.

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `get_project_worklog_summary`

Returns time-tracking summary for a project.

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `get_project_members`

Returns all members of a project.

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `get_project_features`

Returns the feature configuration for a project (modules, cycles, pages, etc.).

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `update_project_features`

Updates which features are enabled on a project.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| feature fields | partial     | No       |

---

### Work Items

#### `list_work_items`

Lists work items in a project, or searches across the workspace when filters are provided.

When any filter parameter is set, the tool uses Plane's advanced search endpoint (supports workspace-wide search). Without filters it uses the standard paginated list endpoint.

| Parameter          | Type        | Required    | Description                                                     |
| ------------------ | ----------- | ----------- | --------------------------------------------------------------- |
| `project_id`       | UUID string | Conditional | Required when no filters are provided                           |
| `query`            | string      | No          | Free-text search across name and description                    |
| `assignee_ids`     | UUID[]      | No          | Filter by assignee                                              |
| `state_ids`        | UUID[]      | No          | Filter by state                                                 |
| `state_groups`     | string[]    | No          | `backlog` · `unstarted` · `started` · `completed` · `cancelled` |
| `priorities`       | string[]    | No          | `urgent` · `high` · `medium` · `low` · `none`                   |
| `label_ids`        | UUID[]      | No          | Filter by label                                                 |
| `type_ids`         | UUID[]      | No          | Filter by work item type                                        |
| `cycle_ids`        | UUID[]      | No          | Filter by cycle                                                 |
| `module_ids`       | UUID[]      | No          | Filter by module                                                |
| `is_archived`      | boolean     | No          | Filter by archived status                                       |
| `created_by_ids`   | UUID[]      | No          | Filter by creator                                               |
| `workspace_search` | boolean     | No          | Search across all projects (requires filters)                   |
| `limit`            | integer     | No          | Max results when using filters                                  |
| `cursor`           | string      | No          | Pagination cursor (list mode)                                   |
| `per_page`         | integer     | No          | Results per page, 1–100 (list mode)                             |
| `expand`           | string      | No          | Comma-separated fields to expand                                |
| `fields`           | string      | No          | Comma-separated fields to include                               |
| `order_by`         | string      | No          | Sort field                                                      |

#### `create_work_item`

Creates a new work item in a project.

| Parameter          | Type        | Required | Description                                   |
| ------------------ | ----------- | -------- | --------------------------------------------- |
| `project_id`       | UUID string | **Yes**  | Target project                                |
| `name`             | string      | **Yes**  | Work item title                               |
| `description_html` | string      | No       | HTML body                                     |
| `state_id`         | UUID string | No       | Initial state                                 |
| `priority`         | string      | No       | `urgent` · `high` · `medium` · `low` · `none` |
| `assignee_ids`     | UUID[]      | No       | Assigned members                              |
| `label_ids`        | UUID[]      | No       | Labels                                        |
| `type_id`          | UUID string | No       | Work item type                                |
| `parent_id`        | UUID string | No       | Parent work item (sub-item)                   |
| `start_date`       | string      | No       | `YYYY-MM-DD`                                  |
| `due_date`         | string      | No       | `YYYY-MM-DD`                                  |

#### `retrieve_work_item`

Returns a single work item by UUID.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `retrieve_work_item_by_identifier`

Returns a work item using its human-readable identifier (e.g., `ENG-42`).

| Parameter              | Type   | Required | Description                 |
| ---------------------- | ------ | -------- | --------------------------- |
| `project_identifier`   | string | **Yes**  | Project prefix, e.g., `ENG` |
| `work_item_identifier` | string | **Yes**  | Issue number, e.g., `42`    |

#### `update_work_item`

Updates one or more fields on a work item. Only supplied fields are changed.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| other fields   | partial     | No       |

#### `delete_work_item`

Permanently deletes a work item.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `search_work_items`

Searches work items by text query within a project.

| Parameter    | Type        | Required | Description |
| ------------ | ----------- | -------- | ----------- |
| `project_id` | UUID string | **Yes**  |             |
| `query`      | string      | **Yes**  | Search text |

---

### Work Item Activities

#### `list_work_item_activities`

Returns the activity log (history of changes) for a work item.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `retrieve_work_item_activity`

Returns a single activity entry.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| `activity_id`  | UUID string | **Yes**  |

---

### Work Item Comments

#### `list_work_item_comments`

Returns all comments on a work item.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `retrieve_work_item_comment`

Returns a single comment.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| `comment_id`   | UUID string | **Yes**  |

#### `create_work_item_comment`

Adds a comment to a work item. Comments are stored as HTML.

| Parameter      | Type        | Required | Description                                         |
| -------------- | ----------- | -------- | --------------------------------------------------- |
| `project_id`   | UUID string | **Yes**  |                                                     |
| `work_item_id` | UUID string | **Yes**  |                                                     |
| `comment_html` | string      | **Yes**  | HTML content, e.g., `<p>Fixed in commit abc123</p>` |

#### `update_work_item_comment`

Updates a comment's content.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| `comment_id`   | UUID string | **Yes**  |
| `comment_html` | string      | **Yes**  |

#### `delete_work_item_comment`

Deletes a comment.

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| `comment_id`   | UUID string | **Yes**  |

---

### Work Item Links

External URLs attached to a work item (e.g., Figma designs, PRs, docs).

#### `list_work_item_links`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `retrieve_work_item_link`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| `link_id`      | UUID string | **Yes**  |

#### `create_work_item_link`

| Parameter      | Type        | Required | Description                |
| -------------- | ----------- | -------- | -------------------------- |
| `project_id`   | UUID string | **Yes**  |                            |
| `work_item_id` | UUID string | **Yes**  |                            |
| `url`          | string      | **Yes**  | External URL               |
| `title`        | string      | No       | Display title for the link |

#### `update_work_item_link`

| Parameter       | Type        | Required |
| --------------- | ----------- | -------- |
| `project_id`    | UUID string | **Yes**  |
| `work_item_id`  | UUID string | **Yes**  |
| `link_id`       | UUID string | **Yes**  |
| `url` / `title` | string      | No       |

#### `delete_work_item_link`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| `link_id`      | UUID string | **Yes**  |

---

### Work Item Relations

Relations between work items (e.g., "blocks", "is blocked by", "duplicate of").

#### `list_work_item_relations`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `create_work_item_relation`

| Parameter              | Type        | Required | Description                                                             |
| ---------------------- | ----------- | -------- | ----------------------------------------------------------------------- |
| `project_id`           | UUID string | **Yes**  |                                                                         |
| `work_item_id`         | UUID string | **Yes**  | Source work item                                                        |
| `related_work_item_id` | UUID string | **Yes**  | Target work item                                                        |
| `relation_type`        | string      | **Yes**  | `blocking` · `blocked_by` · `duplicate_of` · `duplicate` · `relates_to` |

#### `remove_work_item_relation`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| `relation_id`  | UUID string | **Yes**  |

---

### Work Item Properties

Custom fields defined per project.

#### `list_work_item_properties`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `create_work_item_property`

| Parameter       | Type        | Required | Description              |
| --------------- | ----------- | -------- | ------------------------ |
| `project_id`    | UUID string | **Yes**  |                          |
| `name`          | string      | **Yes**  | Property name            |
| `property_type` | string      | **Yes**  | Type of the custom field |

#### `retrieve_work_item_property`

| Parameter     | Type        | Required |
| ------------- | ----------- | -------- |
| `project_id`  | UUID string | **Yes**  |
| `property_id` | UUID string | **Yes**  |

#### `update_work_item_property`

| Parameter     | Type        | Required |
| ------------- | ----------- | -------- |
| `project_id`  | UUID string | **Yes**  |
| `property_id` | UUID string | **Yes**  |

#### `delete_work_item_property`

| Parameter     | Type        | Required |
| ------------- | ----------- | -------- |
| `project_id`  | UUID string | **Yes**  |
| `property_id` | UUID string | **Yes**  |

---

### Work Item Types

Custom work item type definitions (e.g., Bug, Feature, Task, Epic).

#### `list_work_item_types`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `create_work_item_type`

| Parameter     | Type        | Required |
| ------------- | ----------- | -------- |
| `project_id`  | UUID string | **Yes**  |
| `name`        | string      | **Yes**  |
| `description` | string      | No       |
| `is_active`   | boolean     | No       |

#### `retrieve_work_item_type`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |
| `type_id`    | UUID string | **Yes**  |

#### `update_work_item_type`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |
| `type_id`    | UUID string | **Yes**  |

#### `delete_work_item_type`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |
| `type_id`    | UUID string | **Yes**  |

---

### Worklogs

Time tracking for work items. All durations are in **minutes**.

#### `list_work_logs`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `create_work_log`

| Parameter      | Type        | Required | Description          |
| -------------- | ----------- | -------- | -------------------- |
| `project_id`   | UUID string | **Yes**  |                      |
| `work_item_id` | UUID string | **Yes**  |                      |
| `duration`     | integer     | **Yes**  | Minutes logged (≥ 0) |
| `description`  | string      | No       | What was done        |

#### `update_work_log`

| Parameter                  | Type        | Required |
| -------------------------- | ----------- | -------- |
| `project_id`               | UUID string | **Yes**  |
| `work_item_id`             | UUID string | **Yes**  |
| `work_log_id`              | UUID string | **Yes**  |
| `duration` / `description` | -           | No       |

#### `delete_work_log`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |
| `work_log_id`  | UUID string | **Yes**  |

---

### States

Workflow states for a project's work items.

#### `list_states` / `create_state` / `retrieve_state` / `update_state` / `delete_state`

All state tools accept `project_id`. Create and update accept:

| Field         | Type   | Required         | Description                                                     |
| ------------- | ------ | ---------------- | --------------------------------------------------------------- |
| `name`        | string | **Yes** (create) | Display name                                                    |
| `color`       | string | **Yes** (create) | Hex color code, e.g., `#FF5733`                                 |
| `group`       | string | **Yes** (create) | `backlog` · `unstarted` · `started` · `completed` · `cancelled` |
| `description` | string | No               |                                                                 |

---

### Labels

Tags for work items.

#### `list_labels` / `create_label` / `retrieve_label` / `update_label` / `delete_label`

All label tools accept `project_id`. Create and update accept:

| Field    | Type        | Required         |
| -------- | ----------- | ---------------- |
| `name`   | string      | **Yes** (create) |
| `color`  | string      | **Yes** (create) |
| `parent` | UUID string | No               |

---

### Cycles

Time-boxed iterations (sprints).

#### `list_cycles`

Returns all cycles in a project including upcoming, active, and completed.

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `list_archived_cycles`

Returns archived cycles only.

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `create_cycle`

| Parameter     | Type        | Required | Description  |
| ------------- | ----------- | -------- | ------------ |
| `project_id`  | UUID string | **Yes**  |              |
| `name`        | string      | **Yes**  | Cycle name   |
| `start_date`  | string      | No       | `YYYY-MM-DD` |
| `end_date`    | string      | No       | `YYYY-MM-DD` |
| `description` | string      | No       |              |

#### `retrieve_cycle`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |
| `cycle_id`   | UUID string | **Yes**  |

#### `update_cycle` / `delete_cycle`

Accept `project_id` and `cycle_id`.

#### `add_work_items_to_cycle`

| Parameter       | Type        | Required |
| --------------- | ----------- | -------- |
| `project_id`    | UUID string | **Yes**  |
| `cycle_id`      | UUID string | **Yes**  |
| `work_item_ids` | UUID[]      | **Yes**  |

#### `remove_work_item_from_cycle`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `cycle_id`     | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `list_cycle_work_items`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |
| `cycle_id`   | UUID string | **Yes**  |

#### `transfer_cycle_work_items`

Moves all incomplete work items from one cycle to another.

| Parameter      | Type        | Required | Description  |
| -------------- | ----------- | -------- | ------------ |
| `project_id`   | UUID string | **Yes**  |              |
| `cycle_id`     | UUID string | **Yes**  | Source cycle |
| `new_cycle_id` | UUID string | **Yes**  | Target cycle |

---

### Modules

Feature groupings within a project.

#### `list_modules` / `list_archived_modules`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `create_module`

| Parameter     | Type        | Required |
| ------------- | ----------- | -------- |
| `project_id`  | UUID string | **Yes**  |
| `name`        | string      | **Yes**  |
| `description` | string      | No       |
| `start_date`  | string      | No       |
| `target_date` | string      | No       |
| `lead`        | UUID string | No       |
| `members`     | UUID[]      | No       |

#### `retrieve_module` / `update_module` / `delete_module` / `archive_module`

Accept `project_id` and `module_id`.

#### `add_work_items_to_module`

| Parameter       | Type        | Required |
| --------------- | ----------- | -------- |
| `project_id`    | UUID string | **Yes**  |
| `module_id`     | UUID string | **Yes**  |
| `work_item_ids` | UUID[]      | **Yes**  |

#### `remove_work_item_from_module`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `module_id`    | UUID string | **Yes**  |
| `work_item_id` | UUID string | **Yes**  |

#### `list_module_work_items`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |
| `module_id`  | UUID string | **Yes**  |

---

### Epics

Large work items that group related items. The server resolves the Epic work item type automatically.

#### `list_epics` / `create_epic` / `retrieve_epic` / `update_epic` / `delete_epic`

| Parameter               | Type        | Required            |
| ----------------------- | ----------- | ------------------- |
| `project_id`            | UUID string | **Yes**             |
| `epic_id`               | UUID string | Varies by operation |
| name, description, etc. | -           | Varies              |

---

### Milestones

Point-in-time goals within a project.

#### `list_milestones` / `create_milestone` / `retrieve_milestone` / `update_milestone` / `delete_milestone`

| Parameter      | Type        | Required         |
| -------------- | ----------- | ---------------- |
| `project_id`   | UUID string | **Yes**          |
| `milestone_id` | UUID string | Varies           |
| `name`         | string      | **Yes** (create) |

#### `add_work_items_to_milestone`

| Parameter       | Type        | Required |
| --------------- | ----------- | -------- |
| `project_id`    | UUID string | **Yes**  |
| `milestone_id`  | UUID string | **Yes**  |
| `work_item_ids` | UUID[]      | **Yes**  |

#### `remove_work_items_from_milestone`

| Parameter       | Type        | Required |
| --------------- | ----------- | -------- |
| `project_id`    | UUID string | **Yes**  |
| `milestone_id`  | UUID string | **Yes**  |
| `work_item_ids` | UUID[]      | **Yes**  |

#### `list_milestone_work_items`

| Parameter      | Type        | Required |
| -------------- | ----------- | -------- |
| `project_id`   | UUID string | **Yes**  |
| `milestone_id` | UUID string | **Yes**  |

---

### Initiatives

Workspace-scoped strategic goals that span multiple projects.

#### `list_initiatives` / `create_initiative` / `retrieve_initiative` / `update_initiative` / `delete_initiative`

Initiatives are workspace-scoped - no `project_id` required. `retrieve_initiative`, `update_initiative`, and `delete_initiative` accept an `initiative_id` UUID.

---

### Intake

Triage queue for incoming work items before they enter a project.

#### `list_intake_work_items`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |

#### `create_intake_work_item`

| Parameter          | Type        | Required |
| ------------------ | ----------- | -------- |
| `project_id`       | UUID string | **Yes**  |
| `name`             | string      | **Yes**  |
| `description_html` | string      | No       |

#### `retrieve_intake_work_item` / `update_intake_work_item` / `delete_intake_work_item`

Accept `project_id` and `work_item_id`.

---

### Pages

Wiki-style documents. Pages can be workspace-scoped or project-scoped.

#### `retrieve_workspace_page`

| Parameter | Type        | Required |
| --------- | ----------- | -------- |
| `page_id` | UUID string | **Yes**  |

#### `retrieve_project_page`

| Parameter    | Type        | Required |
| ------------ | ----------- | -------- |
| `project_id` | UUID string | **Yes**  |
| `page_id`    | UUID string | **Yes**  |

#### `create_workspace_page`

| Parameter          | Type   | Required |
| ------------------ | ------ | -------- |
| `name`             | string | **Yes**  |
| `description_html` | string | No       |

#### `create_project_page`

| Parameter          | Type        | Required |
| ------------------ | ----------- | -------- |
| `project_id`       | UUID string | **Yes**  |
| `name`             | string      | **Yes**  |
| `description_html` | string      | No       |
