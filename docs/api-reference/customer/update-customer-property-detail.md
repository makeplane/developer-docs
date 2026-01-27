---
title: Update a customer property
description: Update a customer property via Plane API. HTTP PATCH request format, editable fields, and example responses.
keywords: plane, plane api, rest api, api integration, customers, crm, customer management
---


# Update a customer property

<div class="api-endpoint-badge">
  <span class="method patch">PATCH</span>
  <span class="path">/api/v1/workspaces/{workspace_slug}/customer-properties/{property_id}/</span>
</div>

<div class="api-two-column">
<div class="api-left">

Updates an existing customer property definition by setting the values of the parameters passed. Any parameters not provided will be left unchanged.

<div class="params-section">

### Path Parameters

<div class="params-list">

<ApiParam name="workspace_slug" type="string" :required="true">

The workspace_slug represents the unique workspace identifier for a workspace in Plane. It can be found in the URL. For example, in the URL `https://app.plane.so/my-team/projects/`, the workspace slug is `my-team`.

</ApiParam>

<ApiParam name="property_id" type="string" :required="true">

The unique identifier for the customer property.

</ApiParam>

</div>
</div>

<div class="params-section">

### Body Parameters

<div class="params-list">

<ApiParam name="name" type="string">

Name of the property.

</ApiParam>

<ApiParam name="display_name" type="string">

Display name of the property.

</ApiParam>

<ApiParam name="description" type="string">

Description of the property.

</ApiParam>

<ApiParam name="property_type" type="string">

Type of the property.

</ApiParam>

<ApiParam name="relation_type" type="string">

Relation type of the property.

</ApiParam>

<ApiParam name="is_required" type="boolean">

Whether the property is required.

</ApiParam>

<ApiParam name="is_multi" type="boolean">

Whether the property supports multiple values.

</ApiParam>

<ApiParam name="is_active" type="boolean">

Whether the property is active.

</ApiParam>

<ApiParam name="sort_order" type="number">

Sort order for the property.

</ApiParam>

<ApiParam name="default_value" type="string[]">

Default values for the property.

</ApiParam>

<ApiParam name="settings" type="object">

Settings for the property.

</ApiParam>

<ApiParam name="validation_rules" type="object">

Validation rules for the property.

</ApiParam>

<ApiParam name="logo_props" type="object">

Logo properties for the property.

</ApiParam>

<ApiParam name="external_source" type="string">

External source identifier.

</ApiParam>

<ApiParam name="external_id" type="string">

External ID from the external source.

</ApiParam>

</div>
</div>

</div>
<div class="api-right">

<CodePanel title="Update a customer property" :languages="['cURL', 'Python', 'JavaScript']">
<template #curl>

```bash
curl -X PATCH \
  "https://api.plane.so/api/v1/workspaces/my-workspace/customer-properties/{property_id}/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "example-name",
  "display_name": "example-display_name",
  "description": "example-description",
  "property_type": "example-property_type",
  "relation_type": "example-relation_type",
  "is_required": true,
  "is_multi": true,
  "is_active": true,
  "sort_order": 1,
  "default_value": "example-default_value",
  "settings": "example-settings",
  "validation_rules": "example-validation_rules",
  "logo_props": "example-logo_props",
  "external_source": "example-external_source",
  "external_id": "example-external_id"
}'
```

</template>
<template #python>

```python
import requests

response = requests.patch(
    "https://api.plane.so/api/v1/workspaces/my-workspace/customer-properties/{property_id}/",
    headers={"X-API-Key": "your-api-key"},
    json={
  'name': 'example-name',
  'display_name': 'example-display_name',
  'description': 'example-description',
  'property_type': 'example-property_type',
  'relation_type': 'example-relation_type',
  'is_required': true,
  'is_multi': true,
  'is_active': true,
  'sort_order': 1,
  'default_value': 'example-default_value',
  'settings': 'example-settings',
  'validation_rules': 'example-validation_rules',
  'logo_props': 'example-logo_props',
  'external_source': 'example-external_source',
  'external_id': 'example-external_id'
}
)
print(response.json())
```

</template>
<template #javascript>

```javascript
const response = await fetch(
  "https://api.plane.so/api/v1/workspaces/my-workspace/customer-properties/{property_id}/",
  {
    method: "PATCH",
    headers: {
      "X-API-Key": "your-api-key",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  "name": "example-name",
  "display_name": "example-display_name",
  "description": "example-description",
  "property_type": "example-property_type",
  "relation_type": "example-relation_type",
  "is_required": true,
  "is_multi": true,
  "is_active": true,
  "sort_order": 1,
  "default_value": "example-default_value",
  "settings": "example-settings",
  "validation_rules": "example-validation_rules",
  "logo_props": "example-logo_props",
  "external_source": "example-external_source",
  "external_id": "example-external_id"
})
  }
);
const data = await response.json();
```

</template>
</CodePanel>

<ResponsePanel status="200">

```json
{
  "id": "resource-uuid",
  "created_at": "2024-01-01T00:00:00Z"
}
```

</ResponsePanel>

</div>
</div>
