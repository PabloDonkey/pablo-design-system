<script setup lang="ts">
import PScrollArea from "./PScrollArea.vue";

const lines = Array.from({ length: 40 }, (_, i) => `Line ${i + 1} of the scrolling content.`);
</script>

<template>
  <Story title="Primitives/PScrollArea" :layout="{ type: 'grid', width: 360 }">
    <Variant title="subtle (default) — move near the right edge to see it">
      <div class="bg-ground p-4">
        <p class="mb-2 text-micro text-muted">
          Reading the text doesn't paint a scrollbar -- only getting within ~50px of the
          strip on the right edge does.
        </p>
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
<PScrollArea class="h-40">                fixed height
```

**It must be a `height`, not a `max-height`, or it will not actually scroll.** The viewport
inside is `height: 100%` of the root, and a percentage height resolves against an
*indeterminate* containing block (one sized by `max-height` alone, with no explicit `height`)
as `auto` — so the viewport silently grows to match its content instead of clipping it, and
never tells Reka there is anything to scroll. `max-h-40` alone looks right, clips visually
because the root still has `overflow: hidden`, and then does not scroll — the single most
likely mistake with this component.

For a box that should grow with its content up to a cap (rp-engine's composer, whose field
grows with what is typed), there is no way to express "auto, but capped, and still let a
percentage child measure overflow" in CSS alone. The caller computes the clamp itself and
passes an explicit pixel height:

```vue
<PScrollArea :style="{ height: `${Math.min(contentHeightPx, MAX_HEIGHT_PX)}px` }">
```

Padding on the *content* goes through `viewport-class`, not the root class -- the scrollbar
sits beside the viewport, not inside it, so padding on the root would push the scrollbar
away from the edge instead of padding the content.

```vue
<PScrollArea viewport-class="p-3">
```

## `visible` — can the scrollbar ever show?

- **`true` (default).** A thin track and thumb fade in once the pointer is within `50px` of
  the scrollbar itself (or while dragging its thumb), and fade back out otherwise. Distance
  is measured to the scrollbar's own box, not the whole scroll area -- reading text in the
  middle of a long transcript must not paint a scrollbar over it, which is what Reka's own
  `type="hover"` would do (it reveals on hovering *anywhere* in the content). This component
  uses `type="always"` internally instead and drives the opacity itself.
- **`false`.** No scrollbar is ever rendered. The area still scrolls -- by wheel, drag, touch,
  or a script setting `scrollTop` -- there is simply no visual affordance for it, ever. Use
  this where the affordance itself would be noise: rp-engine's composer grows a text field up
  to a fixed height and then scrolls, and a scrollbar appearing on a two-line input reads as
  clutter, not as help.

Which one applies is a caller decision. This component does not guess it from context.

## Thumb colour

The thumb is `muted`, not `hairline`. `hairline` is the same low-opacity tint a 1px border
uses, and that reads fine as a border -- a thin line gets its contrast from the edge, not the
fill -- but disappears as a filled shape at a thumb's size and shape. `muted` is the token
already meant to read as visible-but-quiet content, which is what a thumb actually is.

## Do not

- Do not style the native scrollbar (`::-webkit-scrollbar`) on an element instead of reaching
  for this. The result differs by browser and OS, and this component exists so nobody has to
  find that out again.
- Do not put padding on the root class expecting it to pad the content -- use
  `viewport-class` for that.
</docs>
