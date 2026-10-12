<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    default: undefined,
  },
});
</script>

<template>
  <a v-if="href" :href="href" class="plantag">{{ label }}</a>
  <span v-else class="plantag">{{ label }}</span>
</template>
