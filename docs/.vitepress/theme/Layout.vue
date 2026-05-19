<script setup lang="ts">
import { computed, useSlots } from "vue";
import { useData, Content } from "vitepress";
import VPDefaultLayout from "@voidzero-dev/vitepress-theme/src/components/vitepress-default/Layout.vue";
import OSSHeader from "@voidzero-dev/vitepress-theme/src/components/oss/Header.vue";
import TopBanner from "@voidzero-dev/vitepress-theme/src/components/oss/TopBanner.vue";

const { frontmatter, site } = useData();
const slots = useSlots();

const variant = computed(() => (site.value.themeConfig as { variant?: string }).variant ?? "vite");

// Use the standard doc layout (with sidebar) for doc, page, and home layouts
const useDocLayout = computed(() => {
  const layout = frontmatter.value.layout;
  if (!layout) return true;
  return layout === "doc" || layout === "page" || layout === "home";
});
</script>

<template>
  <div v-if="useDocLayout" class="docs-layout" :data-theme="frontmatter.theme" :data-variant="variant">
    <VPDefaultLayout>
      <template v-for="(_, name) in slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}" />
      </template>
    </VPDefaultLayout>
  </div>
  <div v-else class="marketing-layout" :data-theme="frontmatter.theme" :data-variant="variant">
    <TopBanner />
    <OSSHeader>
      <template #nav-bar-title-before><slot name="nav-bar-title-before" /></template>
      <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
    </OSSHeader>
    <Content />
  </div>
</template>

<style scoped>
.docs-layout,
.marketing-layout {
  min-height: 100vh;
}
</style>
