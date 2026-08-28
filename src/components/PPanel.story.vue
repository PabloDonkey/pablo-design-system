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

<docs lang="md">
# PPanel

The bordered box that holds a block of content. It is the page's basic building unit.

One surface, one hairline border, one radius — so every block on every page looks like it
belongs to the same application. It replaced six copies of the same hand-written card in the
rp-engine admin panel.

## Use it with `PSectionLabel`

The normal pattern is a label above a panel:

```vue
<PSectionLabel class="mb-2">Persona</PSectionLabel>
<PPanel>Mira Vance, a lighthouse keeper's apprentice.</PPanel>
```

The label names the block. The panel holds it. Together they replace `FormSection`, which
was exactly these two things welded into one component.

## `flush`

By default the panel adds its own padding, which is what you want for prose or a form.

Turn on `flush` when the child manages its own spacing:

- a list whose rows need to reach the border and be divided by `border-hairline-soft`
- a scroll region, which has to touch the edge or the scrollbar floats
- anything with a full-width header

```vue
<PPanel flush>
  <div class="border-b border-hairline-soft p-3">First row</div>
  <div class="p-3">Second row</div>
</PPanel>
```

## Do not

- **Do not nest a panel in a panel.** Two borders around the same thing reads as a mistake.
  Use `flush` with divided rows, or `bg-raised`, to show structure inside one frame.
- Do not put a shadow on it. Depth is not how this system separates things; the hairline is.
</docs>
