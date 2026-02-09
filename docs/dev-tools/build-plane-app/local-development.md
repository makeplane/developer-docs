---
title: Local Development
description: Tips for developing Plane apps locally using ngrok.
---

# Local Development

For local development, use [ngrok](https://ngrok.com) to expose your server:

```bash
ngrok http 3000
```

Use the generated URL (e.g., `https://abc123.ngrok.io`) for your Setup URL, Redirect URI, and Webhook URL.

::: info
Free ngrok URLs change on restart. Update your app settings when the URL changes.
:::
