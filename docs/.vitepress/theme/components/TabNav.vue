<script setup>
import { useRoute } from "vitepress";
import { computed } from "vue";

const route = useRoute();

const sections = [
  { text: "Self-hosting", link: "/self-hosting/overview", match: "/self-hosting/" },
  { text: "API Reference", link: "/api-reference/introduction", match: "/api-reference/" },
  { text: "Build & Extend", link: "/dev-tools/build-plane-app/overview", match: "/dev-tools/" },
];

const activeSection = computed(() => {
  const path = route.path;
  for (const section of sections) {
    if (path.startsWith(section.match)) return section.match;
  }
  return "";
});
</script>

<template>
  <div class="tab-nav">
    <div class="tab-nav-wrapper">
      <div class="tab-nav-container">
        <div class="tab-nav-content">
          <div class="tab-nav-inner">
            <a
              v-for="section in sections"
              :key="section.match"
              :href="section.link"
              class="tab-nav-link"
              :class="{ active: activeSection === section.match }"
            >
              {{ section.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
