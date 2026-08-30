<script setup lang="ts">
import PScrollArea from "./PScrollArea.vue";

const lines = Array.from({ length: 40 }, (_, i) => `Line ${i + 1} of the scrolling content.`);
</script>

<template>
  <Story title="Primitives/PScrollArea" :layout="{ type: 'grid', width: 360 }">
    <Variant title="subtle (default) — hover to see it">
      <div class="bg-ground p-4">
        <PScrollArea class="h-48 rounded-panel border border-hairline-soft bg-surface p-3">
          <p v-for="line in lines" :key="line" class="text-body">{{ line }}</p>
        </PScrollArea>
      </div>
    </Variant>

    <Variant title="always invisible">
      <div class="bg-ground p-4">
        <p class="mb-2 text-micro text-muted">
          Scrolls the same way, but no track or thumb ever appears -- rp-engine's composer
          uses this so an auto-growing text field doesn't sprout a scrollbar of its own.
        </p>
        <PScrollArea :visible="false" class="h-24 rounded-control border border-hairline bg-surface p-2">
          <p v-for="line in lines" :key="line" class="text-body">{{ line }}</p>
        </PScrollArea>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PScrollArea

A scroll well with a subtle, cross-browser scrollbar: a track and a thumb, and nothing else --
no native end buttons, and no `::-webkit-scrollbar` rule that Firefox ignores. It wraps Reka
UI's `ScrollArea`.

## Sizing is yours

**PScrollArea brings no height.** Pass a class, the same way `PPanel` takes padding:

```vue
<PScrollArea class="h-full">              fills a flex parent (rp-engine's transcript)
<PScrollArea class="max-h-40">            caps at a fixed height (rp-engine's composer)
```

Padding on the *content* goes through `viewport-class`, not the root class -- the scrollbar
sits beside the viewport, not inside it, so padding on the root would push the scrollbar
away from the edge instead of padding the content.

```vue
<PScrollArea viewport-class="p-3">
```

## `visible` — can the scrollbar ever show?

- **`true` (default).** Reka's own `hover` strategy: nothing is in the DOM until the pointer
  enters the area or it is scrolled, then a thin track and thumb fade in, and fade back out
  when the pointer leaves. This is the ordinary, subtle case.
- **`false`.** No scrollbar is ever rendered. The area still scrolls -- by wheel, drag, touch,
  or a script setting `scrollTop` -- there is simply no visual affordance for it, ever. Use
  this where the affordance itself would be noise: rp-engine's composer grows a text field up
  to a fixed height and then scrolls, and a scrollbar appearing on a two-line input reads as
  clutter, not as help.

Which one applies is a caller decision. This component does not guess it from context.

## Do not

- Do not style the native scrollbar (`::-webkit-scrollbar`) on an element instead of reaching
  for this. The result differs by browser and OS, and this component exists so nobody has to
  find that out again.
- Do not put padding on the root class expecting it to pad the content -- use
  `viewport-class` for that.
</docs>
