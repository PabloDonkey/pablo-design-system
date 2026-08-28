<script setup lang="ts">
import PPanel from "./PPanel.vue";
import PSectionLabel from "./PSectionLabel.vue";
</script>

<template>
  <Story title="Primitives/PPanel" :layout="{ type: 'grid', width: 420 }">
    <Variant title="default">
      <div class="bg-ground p-4">
        <PSectionLabel class="mb-2">Persona</PSectionLabel>
        <PPanel>Mira Vance, a lighthouse keeper's apprentice.</PPanel>
      </div>
    </Variant>

    <Variant title="flush">
      <div class="bg-ground p-4">
        <PPanel flush>
          <div class="border-b border-hairline-soft p-3">First row</div>
          <div class="p-3">Second row</div>
        </PPanel>
      </div>
    </Variant>

    <Variant title="dark">
      <div data-theme="dark" class="bg-ground p-4">
        <PSectionLabel class="mb-2">Persona</PSectionLabel>
        <PPanel>Mira Vance, a lighthouse keeper's apprentice.</PPanel>
      </div>
    </Variant>
  </Story>
</template>
