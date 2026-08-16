---
title: View container logs
description: View and debug container logs for self-hosted Plane. Monitor Docker and Kubernetes service logs to troubleshoot issues.
keywords: plane logs, container logs, docker logs, kubernetes logs, plane debugging, plane troubleshooting, self-hosting
---

# View container logs

If you need to check the logs for troubleshooting or to monitor what’s happening in specific Plane services like the API or Worker, you can access them directly from the command line.

To view logs, start by running the command ↓:

```bash
sudo prime-cli monitor
```

This brings up a table where you can select which container logs you want to view.

![Container logs](/images/view-logs/container-logs.webp#hero)

::: warning
**Prime CLI is for Docker installations only.** These commands only work on Plane instances originally installed using `prime-cli`.
:::

## Community Edition

On the Community Edition run `./setup.sh logs` and pick a service. See [Community Edition → View logs](/self-hosting/community/manage#view-logs).
