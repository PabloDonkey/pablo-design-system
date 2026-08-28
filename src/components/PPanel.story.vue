<script setup lang="ts">
import PPanel from "./PPanel.vue";
import PSectionLabel from "./PSectionLabel.vue";
</script>

<template>
  <Story title="Primitives/PPanel" :layout="{ type: 'grid', width: 440 }">
    <Variant title="default">
      <div class="bg-ground p-4">
        <PSectionLabel class="mb-2">Persona</PSectionLabel>
        <PPanel class="p-3">Mira Vance, a lighthouse keeper's apprentice.</PPanel>
      </div>
    </Variant>

    <Variant title="spacing is yours">
      <div class="flex flex-col gap-3 bg-ground p-4">
        <PPanel class="p-2 text-micro">class="p-2"</PPanel>
        <PPanel class="p-4 text-micro">class="p-4"</PPanel>
        <PPanel class="px-4 py-2 text-micro">class="px-4 py-2" — a prop could not do this</PPanel>
      </div>
    </Variant>

    <Variant title="no padding, divided rows">
      <div class="bg-ground p-4">
        <PPanel>
          <div class="border-b border-hairline-soft p-3">First row</div>
          <div class="p-3">Second row</div>
        </PPanel>
      </div>
    </Variant>

    <Variant title="borderless">
      <div class="bg-ground p-4">
        <PPanel borderless class="p-3">No hairline. The surface alone separates it.</PPanel>
      </div>
    </Variant>

    <Variant title="shadow">
      <div class="flex flex-col gap-4 bg-ground p-4">
        <PPanel shadow="raised" class="p-3">raised — sits slightly proud of the page</PPanel>
        <PPanel shadow="floating" class="p-3">floating — detached, like a menu</PPanel>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PPanel

The box that holds a block of content. It is the page's basic building unit.

One surface, one hairline, one radius, one text colour — so every block on every page looks
like it belongs to the same application. It replaced six copies of the same hand-written card
in the rp-engine admin panel.

## Spacing is yours

**PPanel brings no padding.** Pass a Tailwind class:

```vue
<PPanel class="p-4">Ordinary block</PPanel>
<PPanel class="p-3 md:p-6">Responsive, which a prop could not do</PPanel>
<PPanel class="px-4 py-2">Different on each axis</PPanel>
```

Vue merges your `class` with the component's own, so this just works.

This was a `padding` prop with five steps. It is a class instead because the class gives you
the entire scale, both axes, and responsive variants — everything a fixed list of steps takes
away. The panel keeps the decisions that must be *consistent* (surface, radius, hairline,
text colour) and hands back the one that must be *flexible*.

Leave the padding off when the children bring their own — a divided list, a scroll region,
anything with a full-width header:

```vue
<PPanel>
  <div class="border-b border-hairline-soft p-3">First row</div>
  <div class="p-3">Second row</div>
</PPanel>
```

## `borderless` — is this already separated by something else?

Drop the hairline when a second signal would say the same thing: a panel on a contrasting
ground, a block already tinted, or a panel separated by its own shadow.

Keep the border for the ordinary case. On a light ground a borderless, shadowless panel is
nearly invisible — which the `borderless` story shows honestly.

## `shadow` — is this floating above the page?

- `raised` — sits slightly proud. `0 2px 10px`.
- `floating` — detached. A menu over content, a popover. `0 6px 20px`.

**Shadow means elevation, not separation.** Use it when something genuinely sits above the
page and will be dismissed. Do not use it to show that one block differs from the one next to
it — that is the hairline's job, and a page where every block floats has no foreground left.

Both shadows are tokens, defined per theme. A shadow tuned for a light ground is nearly
invisible on a dark one, so the dark values are considerably deeper.

## Why it sets its own text colour

The panel paints a background, so it also paints `text-ink`. A component that sets a surface
but inherits its foreground is readable only by luck — it depends on whatever colour the host
page happens to have set, which on someone else's dark shell means invisible text. This is
not a detail: it was a real bug here, found by a screenshot.

## Do not

- **Do not nest a panel in a panel.** Two borders around the same thing reads as a mistake.
  Use divided rows, or `bg-raised`, to show structure inside one frame.
- Do not reach for a raw `shadow-lg`. Use the tokens, or the dark theme gets a shadow nobody
  checked.
</docs>
