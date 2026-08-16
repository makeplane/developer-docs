<script setup lang="ts">
import { computed } from "vue";

/**
 * Edition / plan badges for self-hosting pages.
 *
 * <EditionBadge edition="commercial" />                 → "Commercial Edition"
 * <EditionBadge edition="airgapped" plan="enterprise" /> → "Airgapped Edition" + "Enterprise Grid"
 * <EditionBadge edition="community" />                  → "Community Edition"
 *
 * `edition` is the codebase you run; `plan` is the license tier that unlocks a feature.
 */
const props = defineProps<{
  edition?: "commercial" | "airgapped" | "community";
  plan?: "free" | "pro" | "business" | "enterprise";
}>();

const EDITIONS: Record<string, { label: string; type: string }> = {
  commercial: { label: "Commercial Edition", type: "info" },
  airgapped: { label: "Airgapped Edition", type: "info" },
  community: { label: "Community Edition", type: "tip" },
};

const PLANS: Record<string, { label: string; type: string }> = {
  free: { label: "Free", type: "tip" },
  pro: { label: "Pro", type: "tip" },
  business: { label: "Business", type: "tip" },
  enterprise: { label: "Enterprise Grid", type: "warning" },
};

const edition = computed(() => (props.edition ? EDITIONS[props.edition] : null));
const plan = computed(() => (props.plan ? PLANS[props.plan] : null));
</script>

<template>
  <span class="plane-edition-badges">
    <Badge v-if="edition" :type="edition.type" :text="edition.label" />
    <Badge v-if="plan" :type="plan.type" :text="plan.label" />
  </span>
</template>

<style scoped>
.plane-edition-badges {
  display: inline-flex;
  gap: 6px;
  vertical-align: middle;
}
</style>
