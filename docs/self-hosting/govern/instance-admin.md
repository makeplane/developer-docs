---
title: Instance admin and God mode
description: Configure Plane instance admin settings. Learn about God mode and administrative controls for self-hosted Plane.
keywords: plane instance admin, god mode, admin panel, plane administration, instance settings, self-hosting admin
---

# Instance admin and God mode

An instance is a single self-managed installation of Plane on a private cloud or server that the `Instance admin` controls and administers. A single instance can house multiple workspaces.

::: info
There may also be cases where a user IRL is running multiple instances, e.g., when using Plane for several clients. An `Instance admin` role will have to be declared for each of those instances, but it is okay to use the same email address for all of them.
:::

This role lets instance admins access `/god-mode`, a route for features that help them administer and govern their Plane instance better for all users of that instance.

::: tip
New instances allow skipping going to God Mode and setting up your workspace instead. Whatever you choose after secure instance set-up, we highly recommend coming quickly to /god-mode to set up at least your SMTP server so your users can start getting invite emails to projects.
:::

## Settings

God Mode features a few screens as shown below.

### General

The General settings page allows you to view or configure core instance details and telemetry preferences.
Here’s what you can manage:

- **Name of instance**  
  Customize the name of your instance.

- **Email**  
  Displays the instance admin email address.

- **Instance ID**  
  Displays a unique identifier for your instance.

- **Chat with us**  
  Enable or disable in-app chat support for users. Disabling telemetry automatically turns this off.

- **Let Plane collect anonymous usage data**  
  Plane collects anonymized usage data (no PII) to help improve features and overall experience. You can turn this off anytime. See [Telemetry](/self-hosting/telemetry) for more info.

![](/images/instance-admin/god-mode-general.webp#hero)

### Email

Set up your SMTP server here so that Plane can send essential emails (password resets, exports, changes to your instance) and product emails (onboarding, tips, new features) to all your users. [Learn more here](/self-hosting/govern/communication).

![](/images/instance-admin/god-mode-email.webp#hero)

### Authentication

Control what SSO and OAuth services your users can use to sign up and log in to your Plane instance. You can also toggle unique code and password logins on and off from here. [Learn more here](/self-hosting/govern/authentication).

- **Allow anyone to sign up without an invite**  
  Toggle this setting off if you want your users to join the instance only if they receive an invite.

Once SSO is configured, instance admins can also use SSO to log in to God Mode.

::: info
This is where you will see new SSO services and custom OAuth configs in the future.
:::

![](/images/instance-admin/god-mode-authentication.webp#hero)

### Workspaces

The Workspaces section allows you to manage all workspaces within your Plane instance.

- **View all Workspaces**  
  Access a complete list of workspaces on your instance.

- **Create Workspaces**  
  You can create new workspaces directly from this section. If workspace creation is restricted, only the instance admin will have this ability.

- **Restrict Workspace creation**  
  Toggle the **Prevent anyone from creating a workspace** option to prevent anyone else from creating workspaces. Once enabled, only you (the instance admin) can create new workspaces.

To add users to a workspace, you will need to [invite them](https://docs.plane.so/core-concepts/workspaces/members#add-member) after creating it.

::: info
Workspace deletion is currently not supported.
:::

![](/images/instance-admin/god-mode-workspaces.webp#hero)

### User management

View and manage all users across the instance, invite instance admins, and control access to God Mode.

![User management](/images/instance-admin/user-management.webp#hero)

- View all users with their account type, status, and joining date
- Invite new instance admins
- Grant or remove admin access for existing users
- Remove users from the instance

See [User management](/self-hosting/manage/manage-instance-users) for details.

### Images in Plane

You can use your own third-party libraries to update images in project settings. Configure your Unsplash key here. When we add more image libraries, they will show up here.

![](/images/instance-admin/god-mode-images.webp#hero)

## First-run setup

On a fresh instance, the first visit to `/god-mode/` shows the **secure instance setup** form instead of a sign-in screen. Enter the admin's email, a strong password, first name, and company name. Submitting the form creates the instance admin, marks the instance as set up, and opens the General settings above. Until this is done, regular users see an instance-not-set-up screen and nobody can sign in. The full first-run checklist (SMTP, sign-in methods, first workspace, license, HTTPS, backups) is at [After you install](/self-hosting/methods/after-install).

## FAQs

::: details Who is the instance admin?
Whoever completes the secure instance setup at `/god-mode/` on a new instance. That account can invite more instance admins from **User management**. To promote an existing user from the command line on a Docker install, run `docker compose exec api python manage.py create_instance_admin <email>`. On the Community Edition, add `-f plane-app/docker-compose.yaml --env-file plane-app/plane.env` after `docker compose`.
:::

::: details I can't reach /god-mode or I'm locked out. What now?
Check that the instance is running and reachable at your `WEB_URL`. Then contact us on [Discord](https://discord.gg/plane) (Community Edition) or through your support channel (Commercial and Airgapped Editions) with your instance details.
:::

::: details Why aren't password-reset and invitation emails arriving?
SMTP isn't configured. Set it up in **God Mode → Email** (not in the environment file) and send the test email. See [SMTP for email](/self-hosting/govern/communication).
:::

::: details Can I turn unique-code (magic link) sign-in off, or passwords off?
Yes. Both toggles are in **God Mode → Authentication**. Unique codes require SMTP. Passwords are enabled by default when SMTP isn't configured. See [Authentication](/self-hosting/govern/authentication).
:::

::: details Is there a God Mode for Plane Cloud?
No. God Mode is the admin console for self-hosted instances. Plane Cloud workspaces are administered from workspace settings.
:::
