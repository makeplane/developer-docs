import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type * as Plugin from "@docusaurus/types/src/plugin";
import type * as OpenApiPlugin from "docusaurus-plugin-openapi-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Plane developer documentation",
  tagline: "Explore our guides and examples to integrate Plane",
  favicon: "/img/favicon/white/favicon.ico",
  trailingSlash: false,
  onDuplicateRoutes: "warn",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://developers.plane.so",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "makeplane", // Usually your GitHub org/user name.
  projectName: "developer-docs", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  onBrokenAnchors: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
          include: ["**/*.md", "**/*.mdx"],
          editUrl: "https://github.com/makeplane/developer-docs/tree/main",
          sidebarCollapsible: true,
          sidebarCollapsed: true,
          docItemComponent: "@theme/ApiItem", // Derived from docusaurus-theme-openapi
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          lastmod: "date",
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
        },
        gtag: {
          trackingID: process.env.GTAG_TRACKING_ID || "fake",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "https://media.docs.plane.so/logo.svg",
    docs: {
      sidebar: {
        hideable: false,
        autoCollapseCategories: false,
      },
    },
    navbar: {
      title: "Developers",
      logo: {
        alt: "Plane",
        src: "/img/logo/symbol-black.png",
        srcDark: "/img/logo/symbol-white.png",
      },
      items: [
        {
          type: "search",
          position: "left",
        },
        {
          href: "https://docs.plane.so",
          "aria-label": "Plane Docs",
          position: "right",
          className: "navbar--plane-docs-link",
        },
        {
          href: "https://discord.com/invite/A92xrEGCge",
          "aria-label": "Discord",
          position: "right",
          className: "navbar--discord-link",
        },
        {
          href: "https://github.com/makeplane/plane",
          "aria-label": "GitHub",
          position: "right",
          className: "navbar--github-link",
        },
        {
          href: "https://app.plane.so/sign-in",
          label: "Sign in",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Self-Hosting",
              to: "/self-hosting/overview",
            },
            {
              label: "SDKs",
              to: "/sdks/overview",
            },
            {
              label: "AI Solutions",
              to: "/ai-solutions/overview",
            },
            {
              label: "Webhooks",
              to: "/webhooks/overview",
            },
            {
              label: "API Reference",
              to: "/api",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.com/invite/A92xrEGCge",
            },
            {
              label: "X",
              href: "https://twitter.com/planepowers",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/company/planepowers/",
            },
            {
              label: "Discussions",
              href: "https://github.com/orgs/makeplane/discussions",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              href: "https://plane.so/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/makeplane",
            },
          ],
        },
      ],
      // copyright: false,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["ruby", "csharp", "php", "java", "powershell", "json", "bash", "dart", "objectivec", "r"],
    },
    metadata: [
      {
        property: "og:image",
        content: "https://media.docs.plane.so/logo/docs-og.webp",
      },
      {
        name: "twitter:image",
        content: "https://media.docs.plane.so/logo/docs-og.webp",
      },
      {
        name: "keywords",
        content: "project management, issue tracking, sprint management, agile, scrum, create projects, track sprints",
      },
    ],
    colorMode: {
      defaultMode: "light",
    },
    languageTabs: [
      {
        highlight: "bash",
        language: "curl",
      },
      {
        highlight: "python",
        language: "python",
      },
      {
        highlight: "javascript",
        language: "nodejs",
        logoClass: "nodejs",
      },
      {
        highlight: "go",
        language: "go",
      },
      {
        highlight: "ruby",
        language: "ruby",
      },
      {
        highlight: "java",
        language: "java",
        variant: "unirest",
      },
      {
        highlight: "rust",
        language: "rust",
      },
      {
        highlight: "php",
        language: "php",
      },
      {
        highlight: "csharp",
        language: "csharp",
      },
      {
        highlight: "powershell",
        language: "powershell",
      },
      {
        highlight: "dart",
        language: "dart",
      },
      {
        highlight: "javascript",
        language: "javascript",
      },
      {
        highlight: "c",
        language: "c",
      },
      {
        highlight: "objective-c",
        language: "objective-c",
      },
      {
        highlight: "r",
        language: "r",
      },
      {
        highlight: "swift",
        language: "swift",
      },
      {
        highlight: "kotlin",
        language: "kotlin",
      },
    ],
  } satisfies Preset.ThemeConfig,

  stylesheets: [
    // {
    //   href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=National+Park:wght@200..800&family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Raleway:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    //   type: "text/css",
    // },
  ],

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        href: "/fonts/nacelle/nacelle-regular.otf",
        as: "font",
        type: "font/otf",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        href: "/fonts/nacelle/nacelle-light.otf",
        as: "font",
        type: "font/otf",
        crossorigin: "anonymous",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        href: "/fonts/nacelle/nacelle-semibold.otf",
        as: "font",
        type: "font/otf",
        crossorigin: "anonymous",
      },
    },
  ],

  plugins: [
    [
      "@docusaurus/plugin-google-tag-manager",
      {
        containerId: process.env.GOOGLE_TAG_MANAGER_ID || "fake",
      },
    ],
    [
      "docusaurus-plugin-openapi-docs",
      {
        id: "api", // plugin id
        docsPluginId: "classic", // configured for preset-classic
        config: {
          plane: {
            specPath: "api/schema.yaml",
            outputDir: "docs/api",
            sidebarOptions: {
              groupPathsBy: "tag",
            },
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: "/",
      },
    ],
    "docusaurus-theme-openapi-docs",
  ],
};

export default config;
