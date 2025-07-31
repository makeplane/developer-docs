---
title: Introduction
slug: /
sidebar_position: 1
description: Explore our guides and examples to integrate Plane
---

# Plane Developer Documentation

{frontMatter.description && <h3 className="description">{frontMatter.description}</h3>}

:::tip Let's Go!
Get Started with Self-Hosting right away by visiting our [QuickStart](/self-hosting/overview).
:::

Greetings developer! 👋

We're happy you're here. This site is focused on making it easy for you to
integrate with Plane. Whether hosting Plane yourself or creating a custom
integration, this is where you'll find all the fun details you need. 🦾

import { Card } from '@site/src/components/Card';
import { CardGroup } from '@site/src/components/CardGroup';

## Solutions

<CardGroup cols={3}>
  <Card title="Self-Hosting" icon="FaDocker" href="/self-hosting/overview">
    Learn how to self-host Plane.
  </Card>
  <Card title="API Reference" icon="FaCog" href="/api/the-plane-rest-api">
    Use our API reference to build a custom integration.
  </Card>
  <Card title="Webhooks" icon="FaCog" href="/webhooks/overview">
    Learn how to integrate Plane's webhooks with your service.
  </Card>
</CardGroup>
