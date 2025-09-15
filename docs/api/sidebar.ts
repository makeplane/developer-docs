import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/the-plane-rest-api",
    },
    {
      type: "category",
      label: "Assets",
      items: [
        {
          type: "doc",
          id: "api/create-user-asset-upload",
          label: "Generate presigned URL for user asset upload",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/update-user-asset",
          label: "Mark user asset as uploaded",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-user-asset",
          label: "Delete user asset",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/create-generic-asset-upload",
          label: "Generate presigned URL for generic asset upload",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/get-generic-asset",
          label: "Get presigned URL for asset download",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-generic-asset",
          label: "Update generic asset after upload completion",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Intake",
      items: [
        {
          type: "doc",
          id: "api/get-intake-work-items-list",
          label: "List intake work items",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-intake-work-item",
          label: "Create intake work item",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-intake-work-item",
          label: "Retrieve intake work item",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-intake-work-item",
          label: "Update intake work item",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-intake-work-item",
          label: "Delete intake work item",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Cycles",
      items: [
        {
          type: "doc",
          id: "api/list-archived-cycles",
          label: "List archived cycles",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/unarchive-cycle",
          label: "Unarchive cycle",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/list-cycles",
          label: "List cycles",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-cycle",
          label: "Create cycle",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/archive-cycle",
          label: "Archive cycle",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/list-cycle-work-items",
          label: "List cycle work items",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/add-cycle-work-items",
          label: "Add Work Items to Cycle",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-cycle-work-item",
          label: "Retrieve cycle work item",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/delete-cycle-work-item",
          label: "Delete cycle work item",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/transfer-cycle-work-items",
          label: "Transfer cycle work items",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-cycle",
          label: "Retrieve cycle",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-cycle",
          label: "Update cycle",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-cycle",
          label: "Delete cycle",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Labels",
      items: [
        {
          type: "doc",
          id: "api/list-labels",
          label: "Endpoints for label create/update/delete and fetch label details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-label",
          label: "Endpoints for label create/update/delete and fetch label details",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/get-labels",
          label: "Endpoints for label create/update/delete and fetch label details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-label",
          label: "Update a label",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-label",
          label: "Delete a label",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Modules",
      items: [
        {
          type: "doc",
          id: "api/list-archived-modules",
          label: "List archived modules",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/unarchive-module",
          label: "Unarchive module",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/list-modules",
          label: "List modules",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-module",
          label: "Create module",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/list-module-work-items",
          label: "List module work items",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/add-module-work-items",
          label: "Add Work Items to Module",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/delete-module-work-item",
          label: "Delete module work item",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/retrieve-module",
          label: "Retrieve module",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-module",
          label: "Update module",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-module",
          label: "Delete module",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/archive-module",
          label: "Archive module",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "States",
      items: [
        {
          type: "doc",
          id: "api/list-states",
          label: "List states",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-state",
          label: "Create state",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-state",
          label: "Retrieve state",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-state",
          label: "Update state",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-state",
          label: "Delete state",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Members",
      items: [
        {
          type: "doc",
          id: "api/get-workspace-members",
          label: "List workspace members",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/get-project-members",
          label: "List project members",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      items: [
        {
          type: "doc",
          id: "api/get-current-user",
          label: "Get current user",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Projects",
      items: [
        {
          type: "doc",
          id: "api/list-projects",
          label: "List or retrieve projects",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-project",
          label: "Create project",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-project",
          label: "Retrieve project",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-project",
          label: "Update project",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-project",
          label: "Delete project",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/archive-project",
          label: "Archive project",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/unarchive-project",
          label: "Unarchive project",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Work Items",
      items: [
        {
          type: "doc",
          id: "api/get-workspace-work-item",
          label: "Retrieve work item by identifiers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/search-work-items",
          label: "search_work_items",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/list-work-items",
          label: "List work items",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-work-item",
          label: "Create work item",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-work-item",
          label: "Retrieve work item",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-work-item",
          label: "Partially update work item",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-work-item",
          label: "Delete work item",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Work Item Activity",
      items: [
        {
          type: "doc",
          id: "api/list-work-item-activities",
          label: "Endpoints for issue activity/search and fetch issue activity details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/retrieve-work-item-activity",
          label: "Endpoints for issue activity/search and fetch issue activity details",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Work Item Attachments",
      items: [
        {
          type: "doc",
          id: "api/list-work-item-attachments",
          label: "Endpoints for issue attachment create/update/delete and fetch issue attachment details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-work-item-attachment",
          label: "Endpoints for issue attachment create/update/delete and fetch issue attachment details",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-work-item-attachment",
          label: "Endpoints for issue attachment create/update/delete and fetch issue attachment details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/delete-work-item-attachment",
          label: "Endpoints for issue attachment create/update/delete and fetch issue attachment details",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Work Item Comments",
      items: [
        {
          type: "doc",
          id: "api/list-work-item-comments",
          label: "Endpoints for issue comment create/update/delete and fetch issue comment details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-work-item-comment",
          label: "Endpoints for issue comment create/update/delete and fetch issue comment details",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-work-item-comment",
          label: "Endpoints for issue comment create/update/delete and fetch issue comment details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-work-item-comment",
          label: "Endpoints for issue comment create/update/delete and fetch issue comment details",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-work-item-comment",
          label: "Endpoints for issue comment create/update/delete and fetch issue comment details",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Work Item Links",
      items: [
        {
          type: "doc",
          id: "api/list-work-item-links",
          label: "Endpoints for issue link create/update/delete and fetch issue link details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-work-item-link",
          label: "Endpoints for issue link create/update/delete and fetch issue link details",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-work-item-link",
          label: "Endpoints for issue link create/update/delete and fetch issue link details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-issue-link",
          label: "Update an issue link",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-work-item-link",
          label: "Endpoints for issue link create/update/delete and fetch issue link details",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Work Item Properties",
      items: [
        {
          type: "doc",
          id: "api/list-issue-property-options",
          label: "List issue property options",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-issue-property-option",
          label: "Create a new issue property option",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-issue-property-option",
          label: "Get issue property option by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-issue-property-option",
          label: "Update an issue property option",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-issue-property-option",
          label: "Delete an issue property option",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/list-issue-properties",
          label: "List issue properties",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-issue-property",
          label: "Create a new issue property",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-issue-property",
          label: "Get issue property by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-issue-property",
          label: "Update an issue property",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-issue-property",
          label: "Delete an issue property",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/list-issue-property-values",
          label: "List issue property values",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-issue-property-value",
          label: "Create/update an issue property value",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Work Item Types",
      items: [
        {
          type: "doc",
          id: "api/list-issue-types",
          label: "List issue types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-issue-type",
          label: "Create a new issue type",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/retrieve-issue-type",
          label: "Retrieve an issue type by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/update-issue-type",
          label: "Update an issue type",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-issue-type",
          label: "Delete an issue type",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Work Item Worklogs",
      items: [
        {
          type: "doc",
          id: "api/list-issue-worklogs",
          label: "List worklog entries",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api/create-issue-worklog",
          label: "Create a new worklog entry",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api/update-issue-worklog",
          label: "Update a worklog entry",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api/delete-issue-worklog",
          label: "Delete a worklog entry",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api/get-project-worklog-summary",
          label: "Get project worklog summary",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
