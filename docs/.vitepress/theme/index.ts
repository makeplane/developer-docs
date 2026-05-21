import type { Theme } from "vitepress";
import { onMounted, onUnmounted, watch, nextTick, h } from "vue";
import { useRoute, useData } from "vitepress";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import mediumZoom from "medium-zoom";
import VoidZeroTheme from "@voidzero-dev/vitepress-theme";
import { themeContextKey } from "@voidzero-dev/vitepress-theme";

import "./styles.css";
import "./plane-overrides.css";
import "./plane-ui.css";
import "vitepress-plugin-tabs/client";

import ApiParam from "./components/ApiParam.vue";
import CodePanel from "./components/CodePanel.vue";
import ResponsePanel from "./components/ResponsePanel.vue";
import Card from "./components/Card.vue";
import CardGroup from "./components/CardGroup.vue";
import Tags from "./components/Tags.vue";
import CookieConsent from "./components/CookieConsent.vue";
import PlaneLayout from "./Layout.vue";

const PLANE_FOOTER_BG = "https://media.docs.plane.so/logo/og-docs.webp";
const PLANE_MONO_ICON = "/logo/favicon-32x32.png";

function updateLayout() {
  if (typeof document === "undefined") return;

  const path = window.location.pathname;
  const isApiPage =
    path.includes("/api-reference/") && !path.endsWith("/introduction") && !path.endsWith("/introduction.html");

  const vpDoc = document.querySelector(".VPDoc");
  if (vpDoc) {
    vpDoc.classList.toggle("api-page", isApiPage);
  }
}

/** Keep OSS header data-theme aligned with html.dark after hydration */
function syncHeaderTheme() {
  if (typeof document === "undefined") return;

  const isDark = document.documentElement.classList.contains("dark");
  document.querySelectorAll("header.plane-header, header.wrapper").forEach((header) => {
    if (isDark) {
      header.setAttribute("data-theme", "dark");
    } else {
      header.removeAttribute("data-theme");
    }
  });
}

function handleTabHash() {
  if (typeof document === "undefined") return;

  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const tabButtons = document.querySelectorAll('[role="tab"]');
  if (tabButtons.length === 0) return;

  tabButtons.forEach((button) => {
    const labelText = button.textContent?.trim().toLowerCase().replace(/\s+/g, "-");
    if (labelText === hash) {
      const element = button as HTMLElement;
      element.dispatchEvent(
        new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        })
      );
      element.click();
      element.focus();
    }
  });
}

function setupTabHashUpdates() {
  if (typeof document === "undefined") return;

  const tabButtons = document.querySelectorAll('[role="tab"]');
  tabButtons.forEach((button) => {
    const element = button as HTMLElement;
    element.removeEventListener("click", updateHashOnTabClick);
    element.addEventListener("click", updateHashOnTabClick);
  });
}

function updateHashOnTabClick(event: Event) {
  const button = event.currentTarget as HTMLElement;
  const labelText = button.textContent?.trim().toLowerCase().replace(/\s+/g, "-");
  if (labelText) {
    history.replaceState(null, "", `#${labelText}`);
  }
}

function runDomEnhancements() {
  syncHeaderTheme();
}

export default {
  extends: VoidZeroTheme,
  Layout() {
    return h(PlaneLayout, null, {
      "layout-bottom": () => h(CookieConsent),
    });
  },
  enhanceApp(ctx) {
    VoidZeroTheme.enhanceApp?.(ctx);
    const { app } = ctx;

    app.provide(themeContextKey, {
      logoDark: "/logo/dev-logo-watermark-light.png",
      logoLight: "/logo/dev-logo-watermark-dark.png",
      logoAlt: "Plane",
      footerBg: PLANE_FOOTER_BG,
      monoIcon: PLANE_MONO_ICON,
    });

    enhanceAppWithTabs(app);

    app.component("ApiParam", ApiParam);
    app.component("CodePanel", CodePanel);
    app.component("ResponsePanel", ResponsePanel);
    app.component("Card", Card);
    app.component("CardGroup", CardGroup);
    app.component("Tags", Tags);
  },
  setup() {
    if (typeof window === "undefined") return;

    const route = useRoute();
    const { isDark } = useData();
    let zoom: ReturnType<typeof mediumZoom> | null = null;
    let headerObserver: MutationObserver | null = null;
    let htmlClassObserver: MutationObserver | null = null;

    const initZoom = () => {
      zoom?.detach();
      zoom = mediumZoom(".vp-doc :not(a) > img:not(.VPImage)", {
        background: "rgba(0, 0, 0, 0.8)",
      });
    };

    const scheduleEnhancements = () => {
      nextTick(() => {
        runDomEnhancements();
        requestAnimationFrame(runDomEnhancements);
      });
    };

    watch(isDark, () => {
      syncHeaderTheme();
    });

    onMounted(() => {
      nextTick(() => {
        updateLayout();
        initZoom();
        scheduleEnhancements();
      });

      setTimeout(() => {
        handleTabHash();
        setupTabHashUpdates();
        runDomEnhancements();
      }, 100);

      window.addEventListener("hashchange", () => {
        nextTick(handleTabHash);
      });

      window.addEventListener("resize", scheduleEnhancements);

      htmlClassObserver = new MutationObserver(() => {
        syncHeaderTheme();
      });
      htmlClassObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      const navRoot = document.querySelector(".VPNav");
      if (navRoot) {
        headerObserver = new MutationObserver(scheduleEnhancements);
        headerObserver.observe(navRoot, { childList: true, subtree: true });
      }
    });

    onUnmounted(() => {
      htmlClassObserver?.disconnect();
      headerObserver?.disconnect();
      window.removeEventListener("resize", scheduleEnhancements);
      zoom?.detach();
    });

    watch(
      () => route.path,
      () => {
        nextTick(() => {
          updateLayout();
          initZoom();
          handleTabHash();
          setupTabHashUpdates();
          scheduleEnhancements();
        });
      }
    );
  },
} satisfies Theme;
