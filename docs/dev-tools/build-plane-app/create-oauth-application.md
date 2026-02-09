---
title: Create an OAuth Application
description: Register your app to get Client ID and Secret.
---

# Create an OAuth Application

1. Navigate to **Workspace Settings** → **Integrations** (`https://app.plane.so/<workspace>/settings/integrations/`)
2. Click **Build your own**
3. Fill in the required details:

| Field            | Description                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| **App Name**     | Display name shown to users                                                                            |
| **Setup URL**    | Entry point when users install your app. Your app redirects users to Plane's consent screen from here. |
| **Redirect URI** | Callback URL where Plane sends users after they approve access, along with the authorization code.     |
| **Webhook URL**  | Endpoint for receiving event notifications                                                             |

4. For agents that respond to @mentions, enable **"Enable App Mentions"**
5. Save and store your **Client ID** and **Client Secret** securely
6. Select the scopes you need for your app from the **Scopes & Permissions** section. See [OAuth Scopes](/dev-tools/build-plane-app/oauth-scopes) for more information on the available scopes.

::: warning
Never expose your Client Secret in client-side code or commit it to version control.
:::
