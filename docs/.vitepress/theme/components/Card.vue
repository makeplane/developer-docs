<script setup>
import { computed } from "vue";
import * as LucideIcons from "lucide-vue-next";
import { cardBrandIcons } from "./card-brand-icons.js";

const props = defineProps({
  title: String,
  icon: String,
  href: String,
  /** CTA label shown at bottom of card (e.g. "View deployment guides") */
  linkText: String,
});

const lucideIconName = computed(() => {
  if (!props.icon || cardBrandIcons[props.icon]) return null;
  return props.icon
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
});

const IconComponent = computed(() => {
  if (!lucideIconName.value) return null;
  return LucideIcons[lucideIconName.value] || LucideIcons.CircleHelp;
});

const hasCustomIcon = computed(() => props.icon && cardBrandIcons[props.icon]);
</script>

<template>
  <component :is="href ? 'a' : 'div'" :href="href" class="card-link" :class="{ 'card-link--static': !href }">
    <div class="card-head">
      <div v-if="icon" class="card-icon" aria-hidden="true">
        <span class="card-icon__surface">
          <span v-if="hasCustomIcon" class="card-icon__custom" v-html="cardBrandIcons[icon]" />
          <component v-else :is="IconComponent" class="card-icon__lucide" :size="20" :stroke-width="1.75" />
        </span>
      </div>
      <h3 v-if="title" class="card-title">{{ title }}</h3>
    </div>
    <div v-if="$slots.default" class="card-description">
      <slot />
    </div>
    <span v-if="linkText" class="card-cta">
      {{ linkText }}
      <svg class="card-cta__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </component>
</template>

<style scoped>
.card-link {
  color: inherit;
}

.card-link--static {
  cursor: default;
  text-decoration: none !important;
}

.card-link--static:hover {
  text-decoration: none !important;
}

.card-link--static:hover .card-icon__surface {
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
}

.card-link--static:hover .card-cta,
.card-link--static:hover .card-cta__arrow {
  color: var(--vp-c-brand-1);
  transform: none;
}

:global(.card-links) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem 0.625rem;
  margin: 0;
  padding-top: 1rem;
}

:global(.card-links a) {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;
}

:global(.card-links a:hover) {
  color: var(--plane-brand-hover, #0078b8);
  text-decoration: none;
}

:global(.card-links__sep) {
  color: #9ca3af;
  user-select: none;
}

:global(.dark) .card-links__sep,
:global(html.dark) .card-links__sep,
:global([data-theme="dark"]) .card-links__sep {
  color: #6b7280;
}

:global(.dark) .card-links a,
:global(html.dark) .card-links a,
:global([data-theme="dark"]) .card-links a {
  color: #2893cc;
}

:global(.dark) .card-links a:hover,
:global(html.dark) .card-links a:hover,
:global([data-theme="dark"]) .card-links a:hover {
  color: #3aa5d4;
}

.card-head {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  margin-bottom: 0.75rem;
}

.card-icon {
  flex-shrink: 0;
  margin: 0;
  line-height: 0;
}

.card-icon__surface {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  background: color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent);
  color: var(--vp-c-brand-1);
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.card-icon__lucide {
  display: block;
}

.card-icon__custom :deep(svg) {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

.card-title {
  flex: 1;
  min-width: 0;
  margin: 0 !important;
  padding: 0.125rem 0 0 !important;
  align-self: center;
}

.card-description {
  flex: 1;
}

.card-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.2s ease, gap 0.2s ease;
}

.card-cta__arrow {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.card-link:hover .card-icon__surface {
  background: color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent);
}

.card-link:hover .card-cta {
  color: var(--plane-brand-hover, #0078b8);
}

.card-link:hover .card-cta__arrow {
  transform: translateX(2px);
}

:global(.dark) .card-icon__surface,
:global(html.dark) .card-icon__surface,
:global([data-theme="dark"]) .card-icon__surface {
  background: color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  color: #2893cc;
}

:global(.dark) .card-link:hover .card-cta,
:global(html.dark) .card-link:hover .card-cta,
:global([data-theme="dark"]) .card-link:hover .card-cta {
  color: #3aa5d4;
}
</style>
