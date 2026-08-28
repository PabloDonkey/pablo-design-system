<script setup lang="ts">
import PChip from "./PChip.vue";

const tones = ["neutral", "accent", "warning", "danger"] as const;
</script>

<template>
  <Story title="Primitives/PChip" :layout="{ type: 'grid', width: 420 }">
    <Variant title="tones">
      <div class="flex flex-wrap items-center gap-2 bg-ground p-4">
        <PChip v-for="tone in tones" :key="tone" :tone="tone">{{ tone }}</PChip>
      </div>
    </Variant>

    <Variant title="interactive">
      <div class="flex flex-wrap items-center gap-2 bg-ground p-4">
        <PChip interactive>turn 24</PChip>
        <PChip interactive tone="accent">live</PChip>
      </div>
    </Variant>

    <Variant title="dark">
      <div data-theme="dark" class="flex flex-wrap items-center gap-2 bg-ground p-4">
        <PChip v-for="tone in tones" :key="tone" :tone="tone">{{ tone }}</PChip>
      </div>
    </Variant>
  </Story>
</template>
