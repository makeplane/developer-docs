---
title: Build a Plane App
description: Build and integrate an app with Plane using OAuth 2.0 authentication.
---

# Build a Plane App

::: info
Plane apps are currently in **Beta**. Please send any feedback to support@plane.so.
:::

## Overview

Plane uses OAuth 2.0 to allow applications to access workspace data on behalf of users or as an autonomous bot. This comprehensive guide covers everything you need to build, integrate, and deploy apps that extend Plane's functionality.

## What You Can Build

Plane apps enable you to:

- **AI Agents** - Create intelligent agents that respond to @mentions in work item comments
- **Workflow Automation** - Build bots that automate repetitive tasks across your workspace
- **Integrations** - Connect Plane with external tools and services
- **Custom Dashboards** - Build analytics and reporting tools using Plane's data
- **Webhook Handlers** - React to events in real-time as they happen in Plane

## Key Concepts

### OAuth 2.0 Flows

Plane supports two authentication flows:

- **Bot Token Flow** (Client Credentials) - For autonomous apps, agents, and webhooks that act independently
- **User Token Flow** (Authorization Code) - For apps that need to act on behalf of specific users

Most integrations should use the **Bot Token flow**. See [Choose Your Flow](/dev-tools/build-plane-app/choose-token-flow) for detailed implementation guides.

### App Components

A complete Plane app typically includes:

1. **OAuth Application** - Registered in Plane with Client ID and Secret
2. **Setup URL** - Entry point where users begin the installation process
3. **Redirect URI** - Callback endpoint that receives authorization codes
4. **Webhook URL** - Endpoint for receiving real-time event notifications
5. **API Integration** - Code that interacts with Plane's REST API

## Getting Started

Follow these steps to build your first Plane app:

### 1. Create an OAuth Application

Register your app in Plane to get credentials:
- Navigate to **Workspace Settings** → **Integrations**
- Configure your app's URLs and permissions
- Store your **Client ID** and **Client Secret** securely

[Learn more →](/dev-tools/build-plane-app/create-oauth-application)

### 2. Choose Your Authentication Flow

Decide between Bot Token or User Token based on your use case:
- **Bot Token** - For agents, webhooks, and automation
- **User Token** - For user-specific actions and permissions

[Learn more →](/dev-tools/build-plane-app/choose-token-flow)

### 3. Implement OAuth

Set up the OAuth flow to obtain access tokens:
- Redirect users to Plane's consent screen
- Handle the callback with authorization code
- Exchange code for access tokens
- Store tokens securely for API calls

[Learn more →](/dev-tools/build-plane-app/choose-token-flow)

### 4. Make API Requests

Use your access token to interact with Plane's API:
- Include token in `Authorization` header
- Access workspace data, projects, and work items
- Create, update, and manage resources

[Learn more →](/dev-tools/build-plane-app/making-api-requests)

### 5. Handle Webhooks

Set up webhook handlers to receive real-time events:
- Verify webhook signatures for security
- Process events like work item updates, comments, and more
- Respond to events with automated actions

[Learn more →](/dev-tools/build-plane-app/webhooks)

## Development Tools

### Local Development

Use ngrok to expose your local server for testing:
```bash
ngrok http 3000
```

[Learn more →](/dev-tools/build-plane-app/local-development)

### Official SDKs

Speed up development with official SDKs for Node.js and Python:
- OAuth helpers for token management
- Typed API clients for all endpoints
- Built-in error handling and retries

[Learn more →](/dev-tools/build-plane-app/sdks)

### Complete Examples

See full working implementations:
- TypeScript (Express) example
- Python (Flask) example
- OAuth flow, webhooks, and API integration

[Learn more →](/dev-tools/build-plane-app/examples)

## Quick Links

- [API Reference](/api-reference/introduction) - Explore all available endpoints
- [Build an Agent](/dev-tools/agents/overview) - Create AI agents for Plane
- [Webhook Events](/dev-tools/intro-webhooks) - All webhook event types
- [Next Steps](/dev-tools/build-plane-app/next-steps) - What to do after building your app
