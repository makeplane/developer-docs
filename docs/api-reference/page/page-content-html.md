---
title: Page content HTML
description: Format page body HTML, use Plane editor components, and attach files through the Workspace Page API.
keywords: plane, plane api, wiki page, description html, page editor, page attachments
---

# Page content HTML

Send page body content in `description_html` when you create or update a page. Plane sanitizes the HTML, converts it
to the editor document format, and replaces the complete page body during an update.

> Unsupported tags, attributes, and unsafe URLs can be removed. Fetch the page after a write if your integration
> needs to inspect the final stored HTML. The maximum HTML payload is 10 MB.

## Standard HTML

The following shapes are suitable for API-created page content:

| Content         | HTML shape                                                        |
| --------------- | ----------------------------------------------------------------- |
| Paragraph       | `<p>Text</p>`                                                     |
| Headings        | `<h1>Title</h1>` through `<h6>Title</h6>`                         |
| Bold            | `<strong>Bold</strong>`                                           |
| Italic          | `<em>Italic</em>`                                                 |
| Underline       | `<u>Underline</u>`                                                |
| Strikethrough   | `<s>Strike</s>`                                                   |
| Inline code     | `<code>const value = 1</code>`                                    |
| Link            | `<a href="https://plane.so">Plane</a>`                            |
| Blockquote      | `<blockquote><p>Quote</p></blockquote>`                           |
| Code block      | `<pre><code>const value = 1;</code></pre>`                        |
| Bullet list     | `<ul><li>Item</li></ul>`                                          |
| Ordered list    | `<ol start="3"><li>Item</li></ol>`                                |
| Task list       | `<ul data-type="taskList"><li data-checked="true">Done</li></ul>` |
| Horizontal rule | `<hr />`                                                          |
| Table           | `<table><tbody><tr><td>Cell</td></tr></tbody></table>`            |
| Image           | `<img src="https://example.com/image.png" alt="Image" />`         |

URL attributes support safe protocols such as `http`, `https`, `mailto`, and `tel`.

```html
<h1>Project brief</h1>
<p>This page was updated through the API.</p>
<ul data-type="taskList">
  <li data-checked="true">Write the brief</li>
  <li data-checked="false">Review with the team</li>
</ul>
<table>
  <tbody>
    <tr>
      <th>Owner</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>Design</td>
      <td>In progress</td>
    </tr>
  </tbody>
</table>
```

## Plane editor components

Entity-backed components must reference existing Plane entities. Use UUIDs, not human-readable work item keys, and do
not include private user data in page content.

### User mention

```html
<mention-component id="api-user-mention" entity_identifier="USER_UUID" entity_name="user_mention"> </mention-component>
```

### Work item embed

```html
<issue-embed-component
  id="api-work-item-embed"
  entity_identifier="WORK_ITEM_UUID"
  project_identifier="PROJECT_UUID"
  workspace_identifier="WORKSPACE_SLUG"
  entity_name="issue"
>
</issue-embed-component>
```

### Page embed

```html
<page-embed-component
  id="api-page-embed"
  entity_identifier="PAGE_UUID"
  workspace_identifier="WORKSPACE_SLUG"
  entity_name="sub_page"
>
</page-embed-component>
```

### Image component

```html
<image-component
  id="api-image"
  src="https://example.com/image.png"
  width="320"
  height="160"
  alignment="left"
  status="uploaded"
>
</image-component>
```

### Callout

```html
<div data-block-type="callout-component" data-background="#eff6ff" data-logo-in-use="emoji" data-emoji-unicode="128161">
  <p>This is a callout created through the API.</p>
</div>
```

### External embed

```html
<external-embed-component
  id="api-external-embed"
  src="https://plane.so"
  data-entity-name="Plane"
  data-entity-type="link"
  data-is-rich-card="false"
  data-has-tried-embedding="true"
  data-has-embed-failed="false"
>
</external-embed-component>
```

### Math and dates

```html
<p>Inline formula: <inline-math-component id="inline-math" latex="E=mc^2"></inline-math-component></p>
<block-math-component id="block-math" latex="\\int_0^1 x^2 dx"></block-math-component>
<p>Target date: <inline-date-component id="target-date" date="2026-08-18"></inline-date-component></p>
```

## Attach a file

Page attachments use the workspace asset upload flow; there is no multipart page-attachment endpoint.

1. Create upload credentials with
   [`POST /workspaces/{workspace_slug}/assets/`](/api-reference/assets/create-workspace-asset-upload):

   ```json
   {
     "name": "requirements.pdf",
     "type": "application/pdf",
     "size": 12345,
     "entity_type": "PAGE_DESCRIPTION",
     "entity_identifier": "PAGE_UUID"
   }
   ```

2. Upload the file bytes to `upload_data.url` using the returned form fields.
3. Confirm the upload with the
   [page attachment endpoint](/api-reference/page/confirm-workspace-page-attachment-upload).
4. Include the attachment in the complete page body sent through `description_html`:

   ```html
   <attachment-component
     id="ASSET_ID_FROM_PLANE"
     src="ASSET_ID_FROM_PLANE"
     data-name="requirements.pdf"
     data-file-size="12345"
     data-file-type="application/pdf"
     status="uploaded"
   >
   </attachment-component>
   ```

Use the asset ID returned by Plane. Attachment metadata and downloads remain subject to page visibility; confirming or
deleting an attachment requires edit access to an unlocked, active page.
