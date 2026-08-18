---
title: Collection API overview
description: Organize Plane workspace pages into public or private collections and manage collection membership.
keywords: plane, plane api, rest api, collections, wiki pages, collection members
---

# Collection API overview

Collections organize workspace wiki pages. Public collections are visible according to workspace permissions; private
collections are visible only to permitted users. A page and its sub-pages move together when the page is added, moved,
or removed.

## Collection object

<ResponsePanel status="200" title="COLLECTION OBJECT">

```json
{
  "id": "0a8a3e6a-3c32-49c7-bbb5-b7a8e32c2f10",
  "name": "Product docs",
  "owned_by_id": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
  "access": 0,
  "current_user_access": null,
  "has_pages": true,
  "is_default": false,
  "is_global": true,
  "logo_props": { "emoji": "📚" },
  "sort_order": 65535.0,
  "workspace": "95d1f03f-16e5-4807-a8c5-ec0c7cf0e4ab",
  "created_at": "2026-08-18T10:00:00Z",
  "updated_at": "2026-08-18T10:00:00Z",
  "created_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f",
  "updated_by": "d2f1b470-55e8-4e7a-8a61-7fc695bc1a4f"
}
```

</ResponsePanel>

`access` is `0` for public or `1` for private. `current_user_access` is `null` for a public collection. For a private
collection, member access is `0` (view), `1` (comment), or `2` (edit). Collection access cannot be changed after
creation. Private collections require the private collections feature, and only workspace admins can create them. The
creator of a private collection is automatically added with edit access.

Collection edit access allows a member to edit content and arrange pages, but it does not grant collection ownership.
Only the collection owner or a workspace admin can add, update, or remove collection members.
