import { defineConfig, type HeadConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import { withMermaid } from "vitepress-plugin-mermaid";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvVar(key: string): string | undefined {
  // process.env takes precedence (CI/hosting platforms set vars here)
  if (key in process.env) return process.env[key] || undefined;
  // Fall back to .env file for local development
  try {
    const envFile = readFileSync(resolve(process.cwd(), ".env"), "utf-8");
    const match = envFile.match(new RegExp(`^${key}=(.+)$`, "m"));
    return match?.[1]?.trim();
  } catch {
    return undefined;
  }
}

const posthogKey = loadEnvVar("VITE_POSTHOG_KEY");
const algoliaAppId = loadEnvVar("VITE_ALGOLIA_APP_ID");
const algoliaApiKey = loadEnvVar("VITE_ALGOLIA_API_KEY");
const algoliaIndexName = loadEnvVar("VITE_ALGOLIA_INDEX_NAME");

const searchConfig =
  algoliaAppId && algoliaApiKey && algoliaIndexName
    ? {
        provider: "algolia" as const,
        options: {
          appId: algoliaAppId,
          apiKey: algoliaApiKey,
          indexName: algoliaIndexName,
          insights: true,
        },
      }
    : { provider: "local" as const };

const posthogHead: HeadConfig[] = posthogKey
  ? [
      [
        "script",
        {},
        `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init('${posthogKey}',{api_host:'https://us.posthog.com', opt_out_capturing_by_default: true, persistence: 'memory'});
      `,
      ],
    ]
  : [];

export default withMermaid(
  defineConfig({
    markdown: {
      config(md) {
        md.use(tabsMarkdownPlugin);
      },
    },
    mermaid: {
      // Mermaid configuration options
    },
    vite: {
      optimizeDeps: {
        include: [
          "lucide-vue-next",
          "mermaid",
          "@braintree/sanitize-url",
          "dayjs",
          "cytoscape",
          "cytoscape-cose-bilkent",
          "d3",
          "khroma",
          "dagre-d3-es",
          "lodash-es",
          "dompurify",
        ],
      },
    },
    title: "Plane developer documentation",
    description:
      "Self-host Plane, integrate with our API, configure webhooks, and extend your project management platform. Complete guides for developers building on Plane.",

    // SEO: Generate sitemap automatically
    sitemap: {
      hostname: "https://developers.plane.so",
    },

    // SEO: Clean URLs without .html extension
    cleanUrls: true,

    // SEO: Title template for all pages
    titleTemplate: ":title | Plane",

    head: [
      ["link", { rel: "icon", href: "/logo/favicon-32x32.png" }],

      // Google Analytics with Consent Mode v2
      ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-JF828SKW90" }],
      [
        "script",
        {},
        `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
      gtag('js', new Date());
      gtag('config', 'G-JF828SKW90');`,
      ],

      // PostHog Analytics (loaded only when VITE_POSTHOG_KEY is set)
      ...posthogHead,

      // SEO: Basic meta tags
      ["meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
      ["meta", { name: "author", content: "Plane" }],
      ["meta", { name: "robots", content: "index, follow" }],
      [
        "meta",
        {
          name: "keywords",
          content:
            "plane, api, self-hosting, project management, developer documentation, kubernetes, docker, rest api, webhooks, plane api",
        },
      ],
      ["meta", { name: "theme-color", content: "#3b82f6" }],

      // Open Graph meta tags
      ["meta", { property: "og:type", content: "website" }],
      ["meta", { property: "og:title", content: "Developer documentation | Plane" }],
      [
        "meta",
        {
          property: "og:description",
          content:
            "Self-host Plane, integrate with our API, configure webhooks, and extend your project management platform.",
        },
      ],
      ["meta", { property: "og:image", content: "https://media.docs.plane.so/logo/og-docs.webp" }],
      ["meta", { property: "og:url", content: "https://developers.plane.so" }],

      // Twitter Card meta tags
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: "Developer documentation | Plane" }],
      [
        "meta",
        {
          name: "twitter:description",
          content:
            "Self-host Plane, integrate with our API, configure webhooks, and extend your project management platform.",
        },
      ],
      ["meta", { name: "twitter:image", content: "https://media.docs.plane.so/logo/og-docs.webp" }],
    ],

    transformPageData(pageData) {
      const head = (pageData.frontmatter.head ??= []);

      // Inject canonical URL if not already defined in frontmatter
      const hasCanonical = head.some(([tag, attrs]) => tag === "link" && attrs?.rel === "canonical");
      if (!hasCanonical) {
        const canonicalUrl = `https://developers.plane.so/${pageData.relativePath}`
          .replace(/index\.md$/, "")
          .replace(/\.md$/, "");
        head.push(["link", { rel: "canonical", href: canonicalUrl }]);
      }

      // Inject frontmatter keywords as a meta tag (VitePress doesn't do this natively)
      const keywords = pageData.frontmatter.keywords;
      if (keywords) {
        head.push(["meta", { name: "keywords", content: keywords }]);
      }
    },

    themeConfig: {
      siteTitle: false,
      logo: {
        light: "/logo/dev-logo-watermark-light.png",
        dark: "/logo/dev-logo-watermark-dark.png",
      },

      outline: {
        level: [2, 3],
        label: "On this page",
      },

      nav: [
        { text: "Self-hosting", link: "/self-hosting/overview" },
        { text: "API Reference", link: "/api-reference/introduction" },
        { text: "Build and extend", link: "/dev-tools/build-plane-app/overview" },
        { text: "Plane Docs", link: "https://docs.plane.so" },
        { text: "Sign in", link: "https://app.plane.so/sign-in" },
      ],

      sidebar: {
        "/self-hosting/": [
          {
            text: "Self-host Plane",
            items: [
              { text: "Overview", link: "/self-hosting/overview" },
              { text: "Plane Editions", link: "/self-hosting/editions-and-versions" },
              { text: "Plane Architecture", link: "/self-hosting/plane-architecture" },
            ],
          },
          {
            text: "Install",
            items: [
              { text: "Overview", link: "/self-hosting/methods/overview" },
              {
                text: "Docker",
                collapsed: true,
                items: [
                  { text: "Docker Compose", link: "/self-hosting/methods/docker-compose" },
                  { text: "Docker AIO", link: "/self-hosting/methods/docker-aio" },
                  { text: "Docker Swarm", link: "/self-hosting/methods/docker-swarm" },
                  { text: "Download config files", link: "/self-hosting/methods/download-config" },
                ],
              },
              { text: "Kubernetes", link: "/self-hosting/methods/kubernetes" },
              { text: "Podman Quadlets", link: "/self-hosting/methods/podman-quadlets" },
              {
                text: "Airgapped Edition",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/self-hosting/methods/airgapped-requirements" },
                  { text: "For Docker", link: "/self-hosting/methods/airgapped-edition" },
                  { text: "For Kubernetes", link: "/self-hosting/methods/airgapped-edition-kubernetes" },
                  { text: "Clone Docker Images", link: "/self-hosting/methods/clone-docker-images" },
                ],
              },
              {
                text: "Managed Platforms",
                collapsed: true,
                items: [
                  { text: "Coolify", link: "/self-hosting/methods/coolify" },
                  { text: "Portainer", link: "/self-hosting/methods/portainer" },
                ],
              },
            ],
          },
          {
            text: "Configure",
            items: [
              { text: "Instance Admin", link: "/self-hosting/govern/instance-admin" },
              {
                text: "Authentication",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/self-hosting/govern/authentication" },
                  { text: "Google OAuth", link: "/self-hosting/govern/google-oauth" },
                  { text: "GitHub OAuth", link: "/self-hosting/govern/github-oauth" },
                  { text: "OIDC SSO", link: "/self-hosting/govern/oidc-sso" },
                  { text: "SAML SSO", link: "/self-hosting/govern/saml-sso" },
                  { text: "LDAP", link: "/self-hosting/govern/ldap" },
                  { text: "Reset Password", link: "/self-hosting/govern/reset-password" },
                ],
              },
              { text: "SMTP for email", link: "/self-hosting/govern/communication" },
              { text: "External services", link: "/self-hosting/govern/database-and-storage" },
              { text: "Custom domain", link: "/self-hosting/govern/custom-domain" },
              { text: "SSL", link: "/self-hosting/govern/configure-ssl" },
              {
                text: "Integrations",
                collapsed: true,
                items: [
                  { text: "GitHub", link: "/self-hosting/govern/integrations/github" },
                  { text: "GitLab", link: "/self-hosting/govern/integrations/gitlab" },
                  { text: "Sentry", link: "/self-hosting/govern/integrations/sentry" },
                  { text: "Slack", link: "/self-hosting/govern/integrations/slack" },
                ],
              },
              { text: "DNS for Intake Email", link: "/self-hosting/govern/configure-dns-email-service" },
              { text: "OpenSearch for search", link: "/self-hosting/govern/advanced-search" },
              { text: "External secrets", link: "/self-hosting/govern/external-secrets" },
              { text: "External reverse proxy", link: "/self-hosting/govern/reverse-proxy" },
              { text: "Private storage buckets", link: "/self-hosting/govern/private-bucket" },
              { text: "Environment variables", link: "/self-hosting/govern/environment-variables" },
              { text: "Telemetry", link: "/self-hosting/telemetry" },
            ],
          },
          {
            text: "Manage",
            items: [
              {
                text: "Update Plane",
                collapsed: true,
                items: [
                  { text: "Update to latest version", link: "/self-hosting/manage/upgrade-plane" },
                  { text: "For versions before 0.14.0", link: "/self-hosting/manage/upgrade-from-0.13.2-0.14.0" },
                ],
              },
              {
                text: "Manage licenses",
                collapsed: true,
                items: [
                  {
                    text: "Activate Pro or Business",
                    link: "/self-hosting/manage/manage-licenses/activate-pro-and-business",
                  },
                  { text: "Activate Enterprise", link: "/self-hosting/manage/manage-licenses/activate-enterprise" },
                  { text: "Activate Airgapped", link: "/self-hosting/manage/manage-licenses/activate-airgapped" },
                ],
              },
              { text: "Backup and restore", link: "/self-hosting/manage/backup-restore" },
              { text: "Upgrade Community to Commercial Edition", link: "/self-hosting/upgrade-from-community" },
              { text: "Upgrade Community to Airgapped Edition", link: "/self-hosting/manage/community-to-airgapped" },
              { text: "View Logs", link: "/self-hosting/manage/view-logs" },
              { text: "Migrate Plane", link: "/self-hosting/manage/migrate-plane" },
              { text: "Prime CLI", link: "/self-hosting/manage/prime-cli" },
            ],
          },
          {
            text: "Troubleshoot",
            items: [
              { text: "Installation Errors", link: "/self-hosting/troubleshoot/installation-errors" },
              { text: "License Errors", link: "/self-hosting/troubleshoot/license-errors" },
              { text: "CLI Errors", link: "/self-hosting/troubleshoot/cli-errors" },
              { text: "Storage Errors", link: "/self-hosting/troubleshoot/storage-errors" },
            ],
          },
        ],

        "/api-reference/": [
          {
            text: "API Reference",
            items: [
              { text: "Introduction", link: "/api-reference/introduction" },
              {
                text: "Project",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/project/overview" },
                  { text: "Create Project", link: "/api-reference/project/add-project" },
                  { text: "List Projects", link: "/api-reference/project/list-projects" },
                  { text: "Get Project", link: "/api-reference/project/get-project-detail" },
                  { text: "Update Project", link: "/api-reference/project/update-project-detail" },
                  { text: "Delete Project", link: "/api-reference/project/delete-project" },
                ],
              },
              {
                text: "State",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/state/overview" },
                  { text: "Create State", link: "/api-reference/state/add-state" },
                  { text: "List States", link: "/api-reference/state/list-states" },
                  { text: "Get State", link: "/api-reference/state/get-state-detail" },
                  { text: "Update State", link: "/api-reference/state/update-state-detail" },
                  { text: "Delete State", link: "/api-reference/state/delete-state" },
                ],
              },
              {
                text: "Label",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/label/overview" },
                  { text: "Create Label", link: "/api-reference/label/add-label" },
                  { text: "List Labels", link: "/api-reference/label/list-labels" },
                  { text: "Get Label", link: "/api-reference/label/get-label-detail" },
                  { text: "Update Label", link: "/api-reference/label/update-label-detail" },
                  { text: "Delete Label", link: "/api-reference/label/delete-label" },
                ],
              },
              {
                text: "Work Item",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/issue/overview" },
                  { text: "Create Work Item", link: "/api-reference/issue/add-issue" },
                  { text: "List Work Items", link: "/api-reference/issue/list-issues" },
                  { text: "Get Work Item", link: "/api-reference/issue/get-issue-detail" },
                  { text: "Get by Sequence ID", link: "/api-reference/issue/get-issue-sequence-id" },
                  { text: "Search Work Items", link: "/api-reference/issue/search-issues" },
                  { text: "Update Work Item", link: "/api-reference/issue/update-issue-detail" },
                  { text: "Delete Work Item", link: "/api-reference/issue/delete-issue" },
                ],
              },
              {
                text: "Work Item Links",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/link/overview" },
                  { text: "Add Link", link: "/api-reference/link/add-link" },
                  { text: "List Links", link: "/api-reference/link/list-links" },
                  { text: "Get Link", link: "/api-reference/link/get-link-detail" },
                  { text: "Update Link", link: "/api-reference/link/update-link-detail" },
                  { text: "Delete Link", link: "/api-reference/link/delete-link" },
                ],
              },
              {
                text: "Work Item Activity",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/issue-activity/overview" },
                  { text: "List Activities", link: "/api-reference/issue-activity/list-issue-activities" },
                  { text: "Get Activity", link: "/api-reference/issue-activity/get-issue-activity-detail" },
                ],
              },
              {
                text: "Work Item Comments",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/issue-comment/overview" },
                  { text: "Add Comment", link: "/api-reference/issue-comment/add-issue-comment" },
                  { text: "List Comments", link: "/api-reference/issue-comment/list-issue-comments" },
                  { text: "Get Comment", link: "/api-reference/issue-comment/get-issue-comment-detail" },
                  { text: "Update Comment", link: "/api-reference/issue-comment/update-issue-comment-detail" },
                  { text: "Delete Comment", link: "/api-reference/issue-comment/delete-issue-comment" },
                ],
              },
              {
                text: "Work Item Attachments",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/issue-attachments/overview" },
                  { text: "Get Attachments", link: "/api-reference/issue-attachments/get-attachments" },
                  { text: "Get Attachment Detail", link: "/api-reference/issue-attachments/get-attachment-detail" },
                  { text: "Get Upload Credentials", link: "/api-reference/issue-attachments/get-upload-credentials" },
                  { text: "Upload File", link: "/api-reference/issue-attachments/upload-file" },
                  { text: "Complete Upload", link: "/api-reference/issue-attachments/complete-upload" },
                  { text: "Update Attachment", link: "/api-reference/issue-attachments/update-attachment" },
                  { text: "Delete Attachment", link: "/api-reference/issue-attachments/delete-attachment" },
                ],
              },
              {
                text: "Work Item Types",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/issue-types/types/overview" },
                  { text: "Add Type", link: "/api-reference/issue-types/types/add-issue-type" },
                  { text: "List Types", link: "/api-reference/issue-types/types/list-issue-types" },
                  { text: "Get Type Details", link: "/api-reference/issue-types/types/get-issue-type-details" },
                  { text: "Update Type", link: "/api-reference/issue-types/types/update-issue-types" },
                  { text: "Delete Type", link: "/api-reference/issue-types/types/delete-issue-type" },
                ],
              },
              {
                text: "Custom Properties",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/issue-types/properties/overview" },
                  { text: "Add Property", link: "/api-reference/issue-types/properties/add-property" },
                  { text: "List Properties", link: "/api-reference/issue-types/properties/list-properties" },
                  { text: "Get Property Details", link: "/api-reference/issue-types/properties/get-property-details" },
                  { text: "Update Property", link: "/api-reference/issue-types/properties/update-property" },
                  { text: "Delete Property", link: "/api-reference/issue-types/properties/delete-property" },
                ],
              },
              {
                text: "Custom Property Values",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/issue-types/values/overview" },
                  { text: "Add Property Values", link: "/api-reference/issue-types/values/add-property-values" },
                  { text: "List Property Values", link: "/api-reference/issue-types/values/list-property-values" },
                ],
              },
              {
                text: "Custom Property Options",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/issue-types/options/overview" },
                  { text: "Add Dropdown Options", link: "/api-reference/issue-types/options/add-dropdown-options" },
                  { text: "List Dropdown Options", link: "/api-reference/issue-types/options/list-dropdown-options" },
                  { text: "Get Option Details", link: "/api-reference/issue-types/options/get-option-details" },
                  {
                    text: "Update Dropdown Options",
                    link: "/api-reference/issue-types/options/update-dropdown-options",
                  },
                  {
                    text: "Delete Dropdown Options",
                    link: "/api-reference/issue-types/options/delete-dropdown-options",
                  },
                ],
              },
              {
                text: "Cycle",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/cycle/overview" },
                  { text: "Create Cycle", link: "/api-reference/cycle/add-cycle" },
                  { text: "Add Work Items", link: "/api-reference/cycle/add-cycle-work-items" },
                  { text: "Transfer Work Items", link: "/api-reference/cycle/transfer-cycle-work-items" },
                  { text: "Archive Cycle", link: "/api-reference/cycle/archive-cycle" },
                  { text: "List Cycles", link: "/api-reference/cycle/list-cycles" },
                  { text: "Get Cycle", link: "/api-reference/cycle/get-cycle-detail" },
                  { text: "List Cycle Work Items", link: "/api-reference/cycle/list-cycle-work-items" },
                  { text: "List Archived Cycles", link: "/api-reference/cycle/list-archived-cycles" },
                  { text: "Update Cycle", link: "/api-reference/cycle/update-cycle-detail" },
                  { text: "Unarchive Cycle", link: "/api-reference/cycle/unarchive-cycle" },
                  { text: "Remove Work Item", link: "/api-reference/cycle/remove-cycle-work-item" },
                  { text: "Delete Cycle", link: "/api-reference/cycle/delete-cycle" },
                ],
              },
              {
                text: "Module",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/module/overview" },
                  { text: "Create Module", link: "/api-reference/module/add-module" },
                  { text: "Add Work Items", link: "/api-reference/module/add-module-work-items" },
                  { text: "Archive Module", link: "/api-reference/module/archive-module" },
                  { text: "List Modules", link: "/api-reference/module/list-modules" },
                  { text: "Get Module", link: "/api-reference/module/get-module-detail" },
                  { text: "List Module Work Items", link: "/api-reference/module/list-module-work-items" },
                  { text: "List Archived Modules", link: "/api-reference/module/list-archived-modules" },
                  { text: "Update Module", link: "/api-reference/module/update-module-detail" },
                  { text: "Unarchive Module", link: "/api-reference/module/unarchive-module" },
                  { text: "Remove Work Item", link: "/api-reference/module/remove-module-work-item" },
                  { text: "Delete Module", link: "/api-reference/module/delete-module" },
                ],
              },
              {
                text: "Pages",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/page/overview" },
                  { text: "Add Workspace Page", link: "/api-reference/page/add-workspace-page" },
                  { text: "Add Project Page", link: "/api-reference/page/add-project-page" },
                  { text: "Get Workspace Page", link: "/api-reference/page/get-workspace-page" },
                  { text: "Get Project Page", link: "/api-reference/page/get-project-page" },
                ],
              },
              {
                text: "Intake",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/intake-issue/overview" },
                  { text: "Add Intake Issue", link: "/api-reference/intake-issue/add-intake-issue" },
                  { text: "List Intake Issues", link: "/api-reference/intake-issue/list-intake-issues" },
                  { text: "Get Intake Issue", link: "/api-reference/intake-issue/get-intake-issue-detail" },
                  { text: "Update Intake Issue", link: "/api-reference/intake-issue/update-intake-issue-detail" },
                  { text: "Delete Intake Issue", link: "/api-reference/intake-issue/delete-intake-issue" },
                ],
              },
              {
                text: "Time Tracking",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/worklogs/overview" },
                  { text: "Create Worklog", link: "/api-reference/worklogs/create-worklog" },
                  { text: "Get Worklogs for Issue", link: "/api-reference/worklogs/get-worklogs-for-issue" },
                  { text: "Get Total Time", link: "/api-reference/worklogs/get-total-time" },
                  { text: "Update Worklog", link: "/api-reference/worklogs/update-worklog" },
                  { text: "Delete Worklog", link: "/api-reference/worklogs/delete-worklog" },
                ],
              },
              {
                text: "Epics",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/epics/overview" },
                  { text: "List Epics", link: "/api-reference/epics/list-epics" },
                  { text: "Get Epic", link: "/api-reference/epics/get-epic-detail" },
                ],
              },
              {
                text: "Initiatives",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/initiative/overview" },
                  { text: "Create Initiative", link: "/api-reference/initiative/add-initiative" },
                  { text: "List Initiatives", link: "/api-reference/initiative/list-initiatives" },
                  { text: "Get Initiative", link: "/api-reference/initiative/get-initiative-detail" },
                  { text: "Update Initiative", link: "/api-reference/initiative/update-initiative-detail" },
                  { text: "Delete Initiative", link: "/api-reference/initiative/delete-initiative" },
                ],
              },
              {
                text: "Initiative Labels",
                collapsed: true,
                items: [
                  { text: "Add Label", link: "/api-reference/initiative/add-initiative-label" },
                  { text: "Add Labels to Initiative", link: "/api-reference/initiative/add-labels-to-initiative" },
                  { text: "List Initiative Labels", link: "/api-reference/initiative/list-initiative-labels" },
                  { text: "Get Label Detail", link: "/api-reference/initiative/get-initiative-label-detail" },
                  {
                    text: "List Labels for Initiative",
                    link: "/api-reference/initiative/list-initiative-labels-for-initiative",
                  },
                  { text: "Update Label", link: "/api-reference/initiative/update-initiative-label-detail" },
                  { text: "Remove Labels", link: "/api-reference/initiative/remove-labels-from-initiative" },
                  { text: "Delete Label", link: "/api-reference/initiative/delete-initiative-label" },
                ],
              },
              {
                text: "Initiative Projects",
                collapsed: true,
                items: [
                  { text: "Add Projects", link: "/api-reference/initiative/add-projects-to-initiative" },
                  { text: "List Projects", link: "/api-reference/initiative/list-initiative-projects" },
                  { text: "Remove Projects", link: "/api-reference/initiative/remove-projects-from-initiative" },
                ],
              },
              {
                text: "Initiative Epics",
                collapsed: true,
                items: [
                  { text: "Add Epics", link: "/api-reference/initiative/add-epics-to-initiative" },
                  { text: "List Epics", link: "/api-reference/initiative/list-initiative-epics" },
                  { text: "Remove Epics", link: "/api-reference/initiative/remove-epics-from-initiative" },
                ],
              },
              {
                text: "Customers",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/customer/overview" },
                  { text: "Add Customer", link: "/api-reference/customer/add-customer" },
                  { text: "Link Work Items", link: "/api-reference/customer/link-work-items-to-customer" },
                  { text: "List Customers", link: "/api-reference/customer/list-customers" },
                  { text: "Get Customer", link: "/api-reference/customer/get-customer-detail" },
                  { text: "List Customer Work Items", link: "/api-reference/customer/list-customer-work-items" },
                  { text: "Update Customer", link: "/api-reference/customer/update-customer-detail" },
                  { text: "Unlink Work Item", link: "/api-reference/customer/unlink-work-item-from-customer" },
                  { text: "Delete Customer", link: "/api-reference/customer/delete-customer" },
                ],
              },
              {
                text: "Customer Properties",
                collapsed: true,
                items: [
                  { text: "Add Property", link: "/api-reference/customer/add-customer-property" },
                  { text: "List Properties", link: "/api-reference/customer/list-customer-properties" },
                  { text: "Get Property Detail", link: "/api-reference/customer/get-customer-property-detail" },
                  { text: "List Property Values", link: "/api-reference/customer/list-customer-property-values" },
                  { text: "Get Property Value", link: "/api-reference/customer/get-customer-property-value" },
                  { text: "Update Property", link: "/api-reference/customer/update-customer-property-detail" },
                  { text: "Update Property Value", link: "/api-reference/customer/update-customer-property-value" },
                  { text: "Delete Property", link: "/api-reference/customer/delete-customer-property" },
                ],
              },
              {
                text: "Customer Requests",
                collapsed: true,
                items: [
                  { text: "Add Request", link: "/api-reference/customer/add-customer-request" },
                  { text: "List Requests", link: "/api-reference/customer/list-customer-requests" },
                  { text: "Get Request Detail", link: "/api-reference/customer/get-customer-request-detail" },
                  { text: "Update Request", link: "/api-reference/customer/update-customer-request-detail" },
                  { text: "Delete Request", link: "/api-reference/customer/delete-customer-request" },
                ],
              },
              {
                text: "Teamspaces",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/teamspace/overview" },
                  { text: "Create Teamspace", link: "/api-reference/teamspace/add-teamspace" },
                  { text: "List Teamspaces", link: "/api-reference/teamspace/list-teamspaces" },
                  { text: "Get Teamspace", link: "/api-reference/teamspace/get-teamspace-detail" },
                  { text: "Update Teamspace", link: "/api-reference/teamspace/update-teamspace-detail" },
                  { text: "Delete Teamspace", link: "/api-reference/teamspace/delete-teamspace" },
                ],
              },
              {
                text: "Teamspace Members",
                collapsed: true,
                items: [
                  { text: "List Members", link: "/api-reference/teamspace/list-teamspace-members" },
                  { text: "Add Members", link: "/api-reference/teamspace/add-teamspace-members" },
                  { text: "Remove Members", link: "/api-reference/teamspace/remove-teamspace-members" },
                ],
              },
              {
                text: "Teamspace Projects",
                collapsed: true,
                items: [
                  { text: "List Projects", link: "/api-reference/teamspace/list-teamspace-projects" },
                  { text: "Add Projects", link: "/api-reference/teamspace/add-projects-to-teamspace" },
                  { text: "Remove Projects", link: "/api-reference/teamspace/remove-projects-from-teamspace" },
                ],
              },
              {
                text: "Stickies",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/sticky/overview" },
                  { text: "Add Sticky", link: "/api-reference/sticky/add-sticky" },
                  { text: "List Stickies", link: "/api-reference/sticky/list-stickies" },
                  { text: "Get Sticky", link: "/api-reference/sticky/get-sticky-detail" },
                  { text: "Update Sticky", link: "/api-reference/sticky/update-sticky-detail" },
                  { text: "Delete Sticky", link: "/api-reference/sticky/delete-sticky" },
                ],
              },
              {
                text: "Members",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/members/overview" },
                  { text: "Get Workspace Members", link: "/api-reference/members/get-workspace-members" },
                  { text: "Get Project Members", link: "/api-reference/members/get-project-members" },
                ],
              },
              {
                text: "User",
                collapsed: true,
                items: [
                  { text: "Overview", link: "/api-reference/user/overview" },
                  { text: "Get Current User", link: "/api-reference/user/get-current-user" },
                ],
              },
            ],
          },
        ],

        "/dev-tools/": [
          {
            text: "Build on and extend Plane",
            items: [
              {
                text: "Agents",
                link: "/dev-tools/agents/overview",
                collapsed: false,
                items: [
                  { text: "Building an agent", link: "/dev-tools/agents/building-an-agent" },
                  { text: "Best practices", link: "/dev-tools/agents/best-practices" },
                  { text: "Signals and content payload", link: "/dev-tools/agents/signals-content-payload" },
                ],
              },
              {
                text: "Build Plane App",
                link: "/dev-tools/build-plane-app/overview",
                collapsed: false,
                items: [
                  { text: "Create an OAuth application", link: "/dev-tools/build-plane-app/create-oauth-application" },
                  { text: "Choose token Flow", link: "/dev-tools/build-plane-app/choose-token-flow" },
                  { text: "Handling webhooks", link: "/dev-tools/build-plane-app/webhooks" },
                  { text: "OAuth scopes", link: "/dev-tools/build-plane-app/oauth-scopes" },
                  { text: "SDKs", link: "/dev-tools/build-plane-app/sdks" },
                  { text: "Complete examples", link: "/dev-tools/build-plane-app/examples" },
                ],
              },

              {
                text: "MCP Server",
                link: "/dev-tools/mcp-server",
                collapsed: false,
                items: [{ text: "For Claude Code", link: "/dev-tools/mcp-server-claude-code" }],
              },
              { text: "Plane Compose", link: "/dev-tools/plane-compose" },
              { text: "Webhooks", link: "/dev-tools/intro-webhooks" },
            ],
          },
        ],
      },

      socialLinks: [
        { icon: "github", link: "https://github.com/makeplane/plane" },
        { icon: "discord", link: "https://discord.com/invite/A92xrEGCge" },
        { icon: "twitter", link: "https://twitter.com/planepowers" },
        { icon: "linkedin", link: "https://www.linkedin.com/company/planepowers/" },
      ],

      search: searchConfig,

      editLink: {
        pattern: "https://github.com/makeplane/developer-docs/edit/main/:path",
      },

      /*footer: {
      message: 'Released under the Apache License 2.0.',
      copyright: 'Copyright © 2024 Plane'
    }*/
    },
  })
);
