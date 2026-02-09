---
title: Making API Requests
description: How to authenticate API requests using your token.
---

# Making API Requests

Include the token in the `Authorization` header:

```
GET https://api.plane.so/api/v1/workspaces/{workspace_slug}/projects/
Authorization: Bearer YOUR_TOKEN
```

See the [API Reference](/api-reference/introduction) for available endpoints.
