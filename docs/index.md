---
layout: home
title: Plane Developer Documentation - API Reference & Self-Hosting Guides
description: Build integrations with Plane's REST API and deploy on your infrastructure. Complete guides for self-hosting with Docker, Kubernetes, webhooks, and OAuth apps.
keywords: plane developer docs, plane api, self-hosting plane, kubernetes deployment, docker compose, plane webhooks, plane oauth, project management api
hero:
  name: Developer docs
  text: Build, deploy, and integrate
  tagline: Everything you need to self-host Plane, integrate with the REST API, and build powerful custom workflows.
  actions:
    - theme: brand
      text: Get Started
      link: /self-hosting/overview
    - theme: alt
      text: API Reference
      link: /api-reference/introduction

features:
  - icon: 🚀
    title: Self-hosting
    details: Deploy Plane on your infrastructure with Docker, Kubernetes, or Podman. Complete guides for configuration, authentication, and management.
    link: /self-hosting/overview
    linkText: View deployment guides
  - icon: 📡
    title: REST API
    details: 187+ endpoints to manage projects, work items, cycles, modules, and more. Full authentication, pagination, and error handling documentation.
    link: /api-reference/introduction
    linkText: Explore API docs
  - icon: 🔧
    title: Webhooks
    details: Automate workflows with real-time webhooks for project events, issue updates, and team activities.
    link: /dev-tools/intro-webhooks
    linkText: Configure webhooks
  - icon: 🔌
    title: OAuth Apps
    details: Build custom integrations using OAuth 2.0. Complete guides for app registration, token management, and API access.
    link: /dev-tools/build-plane-app
    linkText: Build an app
  - icon: 🤖
    title: MCP Server
    details: Integrate Plane with AI agents using Model Context Protocol for intelligent project management automation.
    link: /dev-tools/mcp-server
    linkText: Setup MCP
---

## Quick start guides

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 2rem 0;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 1.5rem;">

### Deploy with Docker
Get Plane running in minutes with Docker Compose

[Docker Compose](/self-hosting/methods/docker-compose) 

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 1.5rem;">

### Configure Your Instance
Set up authentication and connect external services to your Plane deployment.

[Instance Admin](/self-hosting/govern/instance-admin) • [Configure SSO](/self-hosting/govern/authentication)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 1.5rem;">

### Manage instance
Keep your instance up-to-date with the latest features and security patches.

[Update guide](/self-hosting/manage/upgrade-plane) • [Manage licenses](/self-hosting/manage/manage-licenses/activate-pro-and-business)

</div>

</div>
