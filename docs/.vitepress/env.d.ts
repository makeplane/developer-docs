/// <reference types="vitepress/client" />

import type {} from "vitepress";

declare module "vitepress" {
  namespace DefaultTheme {
    interface Config {
      variant?: "voidzero" | "viteplus" | "vite" | "vitest" | "rolldown" | "oxc";
    }
  }
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "@vp-default/*" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "@components/*" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "@voidzero-dev/vitepress-theme/src/**/*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}
