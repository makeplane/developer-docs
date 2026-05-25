---
title: MCP Server Tool Reference
description: Complete reference for all 136 Plane MCP tools across 20 categories, with parameter details and example workflows.
keywords: plane, mcp server, tools, api reference, work items, cycles, modules, projects
---

# MCP Server Tool Reference

136 tools across 20 categories. All tools work identically regardless of transport mode (OAuth, PAT, or Stdio).

→ Not set up yet? See the [MCP Server setup guide](/dev-tools/mcp-server).

---

## Tool categories

| Category                 | Count | What you can do                                                |
| ------------------------ | ----- | -------------------------------------------------------------- |
| **Projects**             | 20    | Create, update, archive projects; estimates, members, features |
| **Work Items**           | 14    | Create, search, update, archive; assignees, labels             |
| **Cycles**               | 13    | Manage sprints; transfer, archive, complete                    |
| **Modules**              | 11    | Manage feature groups; archive                                 |
| **Pages**                | 9     | Workspace and project pages; link to work items                |
| **Milestones**           | 8     | Create and manage milestones                                   |
| **Work Item Properties** | 8     | Custom field definitions and values                            |
| **Work Item Comments**   | 5     | Create, update, delete comments                                |
| **Work Item Links**      | 5     | Attach external URLs                                           |
| **Work Item Types**      | 5     | Custom type definitions                                        |
| **States**               | 5     | Workflow states                                                |
| **Labels**               | 5     | Work item labels                                               |
| **Initiatives**          | 5     | Workspace-level strategic goals                                |
| **Intake**               | 5     | Triage queue                                                   |
| **Epics**                | 5     | Group related work items                                       |
| **Worklogs**             | 4     | Time tracking                                                  |
| **Work Item Relations**  | 3     | Blocks, duplicate, relates-to                                  |
| **Workspaces**           | 3     | Members and features                                           |
| **Work Item Activities** | 2     | Change history                                                 |
| **Users**                | 1     | Authenticated user info                                        |

---

## Users

| Tool     | Description                                              |
| -------- | -------------------------------------------------------- |
| `get_me` | Returns the authenticated user's profile. No parameters. |

---

## Workspaces

No `project_id` required — workspace-scoped.

| Tool                        | Description                          |
| --------------------------- | ------------------------------------ |
| `get_workspace_members`     | List all workspace members           |
| `get_workspace_features`    | Get enabled workspace features       |
| `update_workspace_features` | Enable or disable workspace features |

---

## Projects

**CRUD**

| Tool                | Description                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `list_projects`     | List all projects in the workspace                                                       |
| `create_project`    | Create a project. Requires `name` and `identifier` (uppercase, max 12 chars, e.g. `ENG`) |
| `retrieve_project`  | Get a project by ID                                                                      |
| `update_project`    | Update project fields                                                                    |
| `delete_project`    | Delete a project                                                                         |
| `archive_project`   | Archive a project                                                                        |
| `unarchive_project` | Restore an archived project                                                              |

**Members & features**

| Tool                          | Description                             |
| ----------------------------- | --------------------------------------- |
| `get_project_members`         | List members in a project               |
| `get_project_features`        | Get enabled features for a project      |
| `update_project_features`     | Enable or disable project features      |
| `get_project_worklog_summary` | Get time-tracking summary for a project |

**Estimates**

Workflow: `get_project_estimate` → `list_project_estimate_points` → pass a point `id` to `update_work_item(estimate_point=...)`.

| Tool                             | Description                           |
| -------------------------------- | ------------------------------------- |
| `get_project_estimate`           | Get the estimate scheme for a project |
| `list_project_estimate_points`   | List all estimate point values        |
| `create_project_estimate`        | Create an estimate scheme             |
| `update_project_estimate`        | Update estimate scheme settings       |
| `delete_project_estimate`        | Delete the estimate scheme            |
| `link_estimate_to_project`       | Link an estimate scheme to a project  |
| `create_project_estimate_points` | Add estimate point values             |
| `update_project_estimate_point`  | Update a single estimate point        |
| `delete_project_estimate_point`  | Remove an estimate point              |

---

## Work Items

**CRUD**

| Tool                               | Description                                                                                                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_work_items`                  | List work items. Supports filters: `query`, `assignee_ids`, `state_ids`, `state_groups`, `priorities`, `label_ids`, `type_ids`, `cycle_ids`, `module_ids`, `is_archived`, `workspace_search` |
| `create_work_item`                 | Create a work item                                                                                                                                                                           |
| `retrieve_work_item`               | Get a work item by UUID                                                                                                                                                                      |
| `retrieve_work_item_by_identifier` | Get by human ID. Requires `project_identifier` (e.g. `ENG`) and `work_item_identifier` (e.g. `42`)                                                                                           |
| `update_work_item`                 | Update work item fields                                                                                                                                                                      |
| `delete_work_item`                 | Delete a work item                                                                                                                                                                           |
| `search_work_items`                | Full-text search across work items                                                                                                                                                           |

**Assignees & labels**

| Tool                        | Description                  |
| --------------------------- | ---------------------------- |
| `add_work_item_assignee`    | Assign a user to a work item |
| `remove_work_item_assignee` | Unassign a user              |
| `add_work_item_label`       | Add a label to a work item   |
| `remove_work_item_label`    | Remove a label               |

**Archive**

| Tool                       | Description                   |
| -------------------------- | ----------------------------- |
| `list_archived_work_items` | List archived work items      |
| `archive_work_item`        | Archive a work item           |
| `unarchive_work_item`      | Restore an archived work item |

---

## Work Item Activities

Both tools require `project_id` and `work_item_id`.

| Tool                          | Description                           |
| ----------------------------- | ------------------------------------- |
| `list_work_item_activities`   | List all change events on a work item |
| `retrieve_work_item_activity` | Get a single activity entry           |

---

## Work Item Comments

| Tool                         | Description                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `list_work_item_comments`    | List all comments on a work item                                                 |
| `retrieve_work_item_comment` | Get a single comment                                                             |
| `create_work_item_comment`   | Create a comment. Requires `comment_html` (e.g. `<p>Fixed in commit abc123</p>`) |
| `update_work_item_comment`   | Update a comment                                                                 |
| `delete_work_item_comment`   | Delete a comment                                                                 |

---

## Work Item Links

External URLs attached to a work item (e.g. Figma designs, PRs).

| Tool                      | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `list_work_item_links`    | List all links on a work item                    |
| `retrieve_work_item_link` | Get a single link                                |
| `create_work_item_link`   | Add a link. Requires `url`. `title` is optional. |
| `update_work_item_link`   | Update a link                                    |
| `delete_work_item_link`   | Remove a link                                    |

---

## Work Item Relations

| Tool                        | Description                                                                                                                                     |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_work_item_relations`  | List all relations for a work item                                                                                                              |
| `create_work_item_relation` | Create a relation. Requires `related_work_item_id` and `relation_type`: `blocking` · `blocked_by` · `duplicate_of` · `duplicate` · `relates_to` |
| `remove_work_item_relation` | Remove a relation                                                                                                                               |

---

## Work Item Properties

Custom fields defined per work item type. Use `list_work_item_types` to get a `work_item_type_id`.

**Property definitions**

All require `project_id` and `work_item_type_id`. Retrieve / update / delete also require `work_item_property_id`.

| Tool                          | Description                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `list_work_item_properties`   | List all custom properties for a work item type                                  |
| `create_work_item_property`   | Create a property. Requires `display_name` and `property_type` (see table below) |
| `retrieve_work_item_property` | Get a property by ID                                                             |
| `update_work_item_property`   | Update a property                                                                |
| `delete_work_item_property`   | Delete a property                                                                |

**`property_type` values**

| Type                                                                    | Extra settings                                                                                 |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `TEXT`                                                                  | `settings: {"display_format": "single-line" \| "multi-line" \| "readonly"}`                    |
| `DATETIME`                                                              | `settings: {"display_format": "MMM dd, yyyy" \| "dd/MM/yyyy" \| "MM/dd/yyyy" \| "yyyy/MM/dd"}` |
| `RELATION`                                                              | `relation_type: "ISSUE"` or `"USER"`                                                           |
| `DECIMAL` · `BOOLEAN` · `OPTION` · `URL` · `EMAIL` · `FILE` · `FORMULA` | —                                                                                              |

**Property values**

All require `project_id`, `work_item_id`, `property_id`.

| Tool                              | Description                      |
| --------------------------------- | -------------------------------- |
| `get_work_item_property_value`    | Get the current value            |
| `set_work_item_property_value`    | Set or update the value (upsert) |
| `delete_work_item_property_value` | Clear the value                  |

**Value format by property type**

| Property type                                  | Value format |
| ---------------------------------------------- | ------------ |
| `TEXT` · `URL` · `EMAIL` · `DATETIME` · `FILE` | `string`     |
| `DECIMAL`                                      | `number`     |
| `BOOLEAN`                                      | `boolean`    |
| `OPTION` · `RELATION` (single)                 | UUID string  |
| `OPTION` · `RELATION` (multi-value)            | UUID array   |

---

## Work Item Types

All require `project_id`. CRUD operations (except list) also require `type_id`.

| Tool                      | Description                           |
| ------------------------- | ------------------------------------- |
| `list_work_item_types`    | List all work item types in a project |
| `create_work_item_type`   | Create a custom type                  |
| `retrieve_work_item_type` | Get a type by ID                      |
| `update_work_item_type`   | Update a type                         |
| `delete_work_item_type`   | Delete a type                         |

---

## Worklogs

Time tracking. All durations are in **minutes**.

| Tool              | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| `list_work_logs`  | List all worklogs for a work item                                                  |
| `create_work_log` | Log time. Requires `project_id`, `work_item_id`, `duration` (integer, minutes ≥ 0) |
| `update_work_log` | Update a worklog entry                                                             |
| `delete_work_log` | Delete a worklog entry                                                             |

---

## States

| Tool             | Description                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_states`    | List all states in a project                                                                                                                 |
| `create_state`   | Create a state. Requires `name`, `color` (hex, e.g. `#FF5733`), and `group`: `backlog` · `unstarted` · `started` · `completed` · `cancelled` |
| `retrieve_state` | Get a state by ID                                                                                                                            |
| `update_state`   | Update a state                                                                                                                               |
| `delete_state`   | Delete a state                                                                                                                               |

---

## Labels

| Tool             | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| `list_labels`    | List all labels in a project                                              |
| `create_label`   | Create a label. Requires `name` and `color`. `parent` (UUID) is optional. |
| `retrieve_label` | Get a label by ID                                                         |
| `update_label`   | Update a label                                                            |
| `delete_label`   | Delete a label                                                            |

---

## Cycles

Time-boxed iterations (sprints).

**CRUD**

| Tool                   | Description                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ |
| `list_cycles`          | List active cycles                                                             |
| `list_archived_cycles` | List archived cycles                                                           |
| `create_cycle`         | Create a cycle. Requires `name`. `start_date` and `end_date` are `YYYY-MM-DD`. |
| `retrieve_cycle`       | Get a cycle by ID                                                              |
| `update_cycle`         | Update cycle fields                                                            |
| `delete_cycle`         | Delete a cycle                                                                 |

**Work items**

| Tool                          | Description                     |
| ----------------------------- | ------------------------------- |
| `list_cycle_work_items`       | List work items in a cycle      |
| `add_work_items_to_cycle`     | Add work items to a cycle       |
| `remove_work_item_from_cycle` | Remove a work item from a cycle |

**Lifecycle**

| Tool                        | Description                                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `transfer_cycle_work_items` | Move all incomplete items to another cycle. Requires `cycle_id` (source) and `new_cycle_id` (target). |
| `complete_cycle`            | Mark a cycle as complete                                                                              |
| `archive_cycle`             | Archive a cycle                                                                                       |
| `unarchive_cycle`           | Restore an archived cycle                                                                             |

---

## Modules

Feature groupings within a project.

**CRUD**

| Tool                    | Description                |
| ----------------------- | -------------------------- |
| `list_modules`          | List all modules           |
| `list_archived_modules` | List archived modules      |
| `create_module`         | Create a module            |
| `retrieve_module`       | Get a module by ID         |
| `update_module`         | Update module fields       |
| `delete_module`         | Delete a module            |
| `archive_module`        | Archive a module           |
| `unarchive_module`      | Restore an archived module |

**Work items**

| Tool                           | Description                      |
| ------------------------------ | -------------------------------- |
| `list_module_work_items`       | List work items in a module      |
| `add_work_items_to_module`     | Add work items to a module       |
| `remove_work_item_from_module` | Remove a work item from a module |

---

## Epics

Large work items that group related items. The server resolves the Epic work item type automatically. All require `project_id`. Specific-epic operations also require `epic_id`.

| Tool            | Description                 |
| --------------- | --------------------------- |
| `list_epics`    | List all epics in a project |
| `create_epic`   | Create an epic              |
| `retrieve_epic` | Get an epic by ID           |
| `update_epic`   | Update epic fields          |
| `delete_epic`   | Delete an epic              |

---

## Milestones

| Tool                               | Description                        |
| ---------------------------------- | ---------------------------------- |
| `list_milestones`                  | List all milestones                |
| `create_milestone`                 | Create a milestone                 |
| `retrieve_milestone`               | Get a milestone by ID              |
| `update_milestone`                 | Update milestone fields            |
| `delete_milestone`                 | Delete a milestone                 |
| `list_milestone_work_items`        | List work items in a milestone     |
| `add_work_items_to_milestone`      | Add work items to a milestone      |
| `remove_work_items_from_milestone` | Remove work items from a milestone |

---

## Initiatives

Workspace-scoped strategic goals. No `project_id` required. Specific-initiative operations require `initiative_id`.

| Tool                  | Description                           |
| --------------------- | ------------------------------------- |
| `list_initiatives`    | List all initiatives in the workspace |
| `create_initiative`   | Create an initiative                  |
| `retrieve_initiative` | Get an initiative by ID               |
| `update_initiative`   | Update initiative fields              |
| `delete_initiative`   | Delete an initiative                  |

---

## Intake

Triage queue for incoming work before it enters a project.

| Tool                        | Description                                              |
| --------------------------- | -------------------------------------------------------- |
| `list_intake_work_items`    | List all intake items in a project                       |
| `create_intake_work_item`   | Create an intake item. Requires `project_id` and `name`. |
| `retrieve_intake_work_item` | Get an intake item by ID                                 |
| `update_intake_work_item`   | Update or triage an item (accept / decline / snooze)     |
| `delete_intake_work_item`   | Delete an intake item                                    |

---

## Pages

Wiki-style documents, workspace-scoped or project-scoped.

**Workspace pages**

| Tool                      | Description                    |
| ------------------------- | ------------------------------ |
| `list_workspace_pages`    | List all workspace-level pages |
| `retrieve_workspace_page` | Get a workspace page by ID     |
| `create_workspace_page`   | Create a workspace page        |

**Project pages**

| Tool                    | Description                 |
| ----------------------- | --------------------------- |
| `list_project_pages`    | List all pages in a project |
| `retrieve_project_page` | Get a project page by ID    |
| `create_project_page`   | Create a project page       |

**Work item page links**

| Tool                         | Description                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------- |
| `list_work_item_pages`       | List pages linked to a work item                                                |
| `attach_page_to_work_item`   | Link a page. Requires `project_id`, `work_item_id`, `page_id`.                  |
| `detach_page_from_work_item` | Unlink a page. Requires `work_item_page_id` (the link UUID, not the page UUID). |

---

## Example workflows

**Look up a work item**

> What is ENG-42 about?

→ `retrieve_work_item_by_identifier(project_identifier="ENG", work_item_identifier="42")`

---

**Create and assign a work item**

> Create a high-priority bug in ENG: "Login times out on Safari". Assign to me.

→ `get_me` → `create_work_item`

---

**Update state and leave a comment**

> Mark ENG-88 as done and comment "Fixed in commit abc1234, needs QA."

→ `list_states` → `update_work_item` + `create_work_item_comment`

---

**Plan a sprint**

> Create Sprint 15 in ENG starting 2025-06-02 ending 2025-06-15. Move all incomplete issues from Sprint 14.

→ `create_cycle` → `list_cycles` → `transfer_cycle_work_items`

---

**Filter work items**

> Show all high-priority bugs assigned to me still in progress.

→ `list_work_items(priorities=["high"], state_groups=["started"], assignee_ids=[...])`

---

**Log time**

> Log 90 minutes on ENG-42: "Implemented retry logic."

→ `retrieve_work_item_by_identifier` → `create_work_log(duration=90)`

---

**Code + project management**

> Look up ENG-42, implement what it describes in src/auth.ts, then mark it as done and log 2 hours.

→ `retrieve_work_item_by_identifier` → (code edits) → `update_work_item(state_id=...)` + `create_work_log(duration=120)`

---

**Triage intake**

> Show all intake items in MOBILE and accept the ones related to crash reports.

→ `list_intake_work_items` → `update_intake_work_item` (status: accepted)
