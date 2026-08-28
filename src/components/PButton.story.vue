<script setup lang="ts">
import PButton from "./PButton.vue";

const variants = ["primary", "secondary", "danger", "ghost"] as const;
</script>

<template>
  <Story title="Primitives/PButton" :layout="{ type: 'grid', width: 420 }">
    <Variant v-for="variant in variants" :key="variant" :title="variant">
      <div class="flex flex-wrap items-center gap-2 bg-ground p-4">
        <PButton :variant="variant" size="sm">Small</PButton>
        <PButton :variant="variant">Normal</PButton>
        <PButton :variant="variant" disabled>Disabled</PButton>
      </div>
    </Variant>

    <!-- One attribute switches the whole palette. This is the argument for
         putting the theme in the token rather than in a `dark:` class. -->
    <Variant title="dark">
      <div data-theme="dark" class="flex flex-wrap items-center gap-2 bg-ground p-4">
        <PButton v-for="variant in variants" :key="variant" :variant="variant">
          {{ variant }}
        </PButton>
      </div>
    </Variant>
  </Story>
</template>
