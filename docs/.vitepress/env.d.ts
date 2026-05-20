/// <reference types="vitepress/client" />
/// <reference path="./types/ambient-modules.d.ts" />

import type {} from "vitepress";

declare module "vitepress" {
  namespace DefaultTheme {
    interface Config {
      variant?: "voidzero" | "viteplus" | "vite" | "vitest" | "rolldown" | "oxc";
    }
  }
}
