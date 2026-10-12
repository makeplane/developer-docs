<script lang="ts" setup>
defineProps<{
  text: string;
}>();
</script>

<template>
  <button type="button" class="VPNavBarSearchButton search-bar">
    <span class="vpi-search" aria-hidden="true"></span>
    <span class="text search-bar__text">{{ text }}</span>
    <span class="keys search-bar__keys" aria-hidden="true">
      <kbd class="key-cmd">&#x2318;</kbd>
      <kbd class="key-ctrl">Ctrl</kbd>
      <kbd>K</kbd>
    </span>
  </button>
</template>

<style scoped>
.search-bar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  justify-content: flex-start;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  font-family: inherit;
}

.search-bar__text {
  flex: 0 1 auto;
  text-align: left;
  font-size: 13px;
}

.search-bar__keys {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.search-bar kbd {
  font-family: inherit;
  font-weight: 500;
  background: none;
  border: none;
  padding: 0;
}

:root.mac .search-bar .key-ctrl,
:root:not(.mac) .search-bar .key-cmd {
  display: none;
}

@media (max-width: 767px) {
  .search-bar {
    padding: 8px;
  }

  .search-bar__text,
  .search-bar__keys {
    display: none;
  }
}
</style>
