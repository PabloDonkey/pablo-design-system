<script setup lang="ts">
/**
 * The bordered box every block on every page sits in.
 *
 * `flush` turns the padding off for a panel whose child manages its own
 * spacing -- a list whose rows need to reach the border, or a scroll region.
 */

const props = withDefaults(
  defineProps<{
    flush?: boolean;
  }>(),
  { flush: false },
);

const base = "rounded-panel border border-hairline bg-surface text-body";
</script>

<template>
  <div :class="[base, props.flush ? '' : 'p-3']">
    <slot />
  </div>
</template>
