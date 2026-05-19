import type { Theme } from "vitepress";
import { onMounted, watch, nextTick, h } from "vue";
import { useRoute } from "vitepress";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import mediumZoom from "medium-zoom";
import VitestTheme from "@voidzero-dev/vitepress-theme/src/vitest";
import { themeContextKey, VPHomeHero, VPHomeFeatures } from "@voidzero-dev/vitepress-theme";
import footerBg from "@voidzero-dev/vitepress-theme/src/assets/vitest/footer-background.jpg";
import monoIcon from "@voidzero-dev/vitepress-theme/src/assets/icons/vitest-mono.svg";

import "./styles.css";
import "./plane-overrides.css";
import "vitepress-plugin-tabs/client";

import ApiParam from "./components/ApiParam.vue";
import CodePanel from "./components/CodePanel.vue";
import ResponsePanel from "./components/ResponsePanel.vue";
import Card from "./components/Card.vue";
import CardGroup from "./components/CardGroup.vue";
import CookieConsent from "./components/CookieConsent.vue";
import PlaneLayout from "./Layout.vue";

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

export default {
  extends: VitestTheme,
  Layout() {
    return h(PlaneLayout, null, {
      "layout-bottom": () => h(CookieConsent),
    });
  },
  enhanceApp(ctx) {
    VitestTheme.enhanceApp?.(ctx);
    const { app } = ctx;

    app.provide(themeContextKey, {
      logoDark: "/logo/dev-logo-watermark-light.png",
      logoLight: "/logo/dev-logo-watermark-dark.png",
      logoAlt: "Plane",
      footerBg,
      monoIcon,
    });

    enhanceAppWithTabs(app);

    app.component("ApiParam", ApiParam);
    app.component("CodePanel", CodePanel);
    app.component("ResponsePanel", ResponsePanel);
    app.component("Card", Card);
    app.component("CardGroup", CardGroup);
    app.component("VPHomeHero", VPHomeHero);
    app.component("VPHomeFeatures", VPHomeFeatures);
  },
  setup() {
    if (typeof window === "undefined") return;

    const route = useRoute();
    let zoom: ReturnType<typeof mediumZoom> | null = null;

    const initZoom = () => {
      zoom?.detach();
      zoom = mediumZoom(".vp-doc :not(a) > img:not(.VPImage)", {
        background: "rgba(0, 0, 0, 0.8)",
      });
    };

    onMounted(() => {
      nextTick(updateLayout);
      initZoom();
      setTimeout(() => {
        handleTabHash();
        setupTabHashUpdates();
      }, 100);

      window.addEventListener("hashchange", () => {
        nextTick(handleTabHash);
      });
    });

    watch(
      () => route.path,
      () => {
        nextTick(() => {
          updateLayout();
          initZoom();
          handleTabHash();
          setupTabHashUpdates();
        });
      }
    );
  },
} satisfies Theme;
