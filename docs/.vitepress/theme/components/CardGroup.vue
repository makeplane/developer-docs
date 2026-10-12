<script setup>
import { computed } from "vue";

const props = defineProps({
  cols: {
    type: [Number, String],
    default: 2,
  },
  /** Alias for cols */
  columns: {
    type: [Number, String],
    default: undefined,
  },
});

const columnCount = computed(() => {
  const n = props.columns ?? props.cols;
  return Number(n) || 2;
});
</script>

<template>
  <div
    class="card-group"
    :class="{
      'card-group-2': columnCount === 2,
      'card-group-3': columnCount === 3,
      'card-group-4': columnCount === 4,
    }"
  >
    <slot />
  </div>
</template>
