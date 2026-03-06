---
title: Troubleshooting
description: Diagnose and resolve issues with your self-hosted Plane instance.
---

# Troubleshooting

When something goes wrong, start by identifying which service is affected, then check the relevant logs.

## Identify the service

| Problem area                                                 | Service    | Logs to check      |
| ------------------------------------------------------------ | ---------- | ------------------ |
| UI not loading, blank screens, page errors                   | web        | `plane-web`        |
| Public pages or published views not working                  | space      | `plane-space`      |
| Instance settings or billing issues                          | admin      | `plane-admin`      |
| API errors, data not saving, 500 errors                      | api        | `plane-api`        |
| Imports stuck, notifications delayed, file processing issues | worker     | `plane-worker`     |
| Scheduled tasks or reminders not running                     | beat       | `plane-beat`       |
| Upgrade failures, database schema errors                     | migrator   | `plane-migrator`   |
| SSL errors, 502/504 errors, routing issues                   | proxy      | `plane-proxy`      |
| Real-time sync, live cursors, or presence not working        | live       | `plane-live`       |
| License activation or validation errors                      | monitor    | `plane-monitor`    |
| GitHub, GitLab, or Slack integration issues                  | silo       | `plane-silo`       |
| Email-to-work-item not working                               | intake     | `plane-intake`     |
| File uploads or attachments failing                          | minio      | `plane-minio`      |
| Search not returning results                                 | opensearch | `plane-opensearch` |

See [View logs](/self-hosting/manage/view-logs) for commands to access logs in Docker deployments.

## Common issues

- [Installation errors](/self-hosting/troubleshoot/installation-errors)
- [License errors](/self-hosting/troubleshoot/license-errors)
- [CLI errors](/self-hosting/troubleshoot/cli-errors)
- [Storage errors](/self-hosting/troubleshoot/storage-errors)
