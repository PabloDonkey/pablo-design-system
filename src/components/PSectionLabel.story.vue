<script setup lang="ts">
import PSectionLabel from "./PSectionLabel.vue";
</script>

<template>
  <Story title="Primitives/PSectionLabel" :layout="{ type: 'grid', width: 420 }">
    <Variant title="sizes">
      <div class="flex flex-col gap-3 bg-ground p-4">
        <PSectionLabel size="md">Medium — section heading</PSectionLabel>
        <PSectionLabel size="sm">Small — eyebrow</PSectionLabel>
      </div>
    </Variant>

    <Variant title="dark">
      <div data-theme="dark" class="flex flex-col gap-3 bg-ground p-4">
        <PSectionLabel size="md">Medium — section heading</PSectionLabel>
        <PSectionLabel size="sm">Small — eyebrow</PSectionLabel>
      </div>
    </Variant>
  </Story>
</template>
