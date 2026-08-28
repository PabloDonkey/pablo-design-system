<script setup lang="ts">
import PPanel from "./PPanel.vue";
import PSectionLabel from "./PSectionLabel.vue";
</script>

<template>
  <Story title="Primitives/PPanel" :layout="{ type: 'grid', width: 440 }">
    <Variant title="default">
      <div class="bg-ground p-4">
        <PSectionLabel class="mb-2">Persona</PSectionLabel>
        <PPanel>Mira Vance, a lighthouse keeper's apprentice.</PPanel>
      </div>
    </Variant>

    <Variant title="borderless">
      <div class="bg-ground p-4">
        <PPanel borderless>No hairline. The surface alone separates it.</PPanel>
      </div>
    </Variant>

    <Variant title="shadow">
      <div class="flex flex-col gap-4 bg-ground p-4">
        <PPanel shadow="raised">raised — sits slightly proud of the page</PPanel>
        <PPanel shadow="floating">floating — detached, like a menu over content</PPanel>
      </div>
    </Variant>

    <Variant title="borderless + floating">
      <div class="bg-ground p-4">
        <PPanel borderless shadow="floating">
          Depth alone does the separating, so the hairline would be a second
          signal saying the same thing.
        </PPanel>
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
      <div data-theme="dark" class="flex flex-col gap-4 bg-ground p-4">
        <PSectionLabel>Persona</PSectionLabel>
        <PPanel>Bordered</PPanel>
        <PPanel borderless>Borderless</PPanel>
        <PPanel shadow="floating">Floating</PPanel>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PPanel

The box that holds a block of content. It is the page's basic building unit.

One surface, one hairline, one radius — so every block on every page looks like it belongs to
the same application. It replaced six copies of the same hand-written card in the rp-engine
admin panel.

## Use it with `PSectionLabel`

The normal pattern is a label above a panel:

```vue
<PSectionLabel class="mb-2">Persona</PSectionLabel>
<PPanel>Mira Vance, a lighthouse keeper's apprentice.</PPanel>
```

The label names the block, the panel holds it. Together they replace `FormSection`, which was
exactly these two things welded into one component.

## The three options

Each answers a different question. They combine freely.

### `flush` — does the child manage its own spacing?

By default the panel pads its own content, which is what prose and forms want. Turn `flush`
on when the child needs to reach the border:

- a list whose rows are divided by `border-hairline-soft`
- a scroll region, which has to touch the edge or the scrollbar floats
- anything with a full-width header

### `borderless` — is this already separated by something else?

Drop the hairline when a second signal would be saying the same thing: a panel on a
contrasting ground, a block that is already tinted, or a panel that floats and is separated
by its shadow instead.

Keep the border for the ordinary case. On a light ground a borderless, shadowless panel is
nearly invisible.

### `shadow` — is this floating above the page?

- `raised` — sits slightly proud. `0 2px 10px`.
- `floating` — detached from the page. A menu over content, a popover. `0 6px 20px`.

**Shadow means elevation, not separation.** Use it when something genuinely sits above the
page and will be dismissed. Do not use it to show that one block is different from the block
next to it — that is the hairline's job, and a page where every block floats has no
foreground left.

Both shadows are tokens, and both are defined per theme. A shadow tuned for a light ground is
nearly invisible on a dark one, so the dark values are considerably deeper.

## Do not

- **Do not nest a panel in a panel.** Two borders around the same thing reads as a mistake.
  Use `flush` with divided rows, or `bg-raised`, to show structure inside one frame.
- Do not reach for a raw `shadow-lg`. Use the tokens, or the dark theme gets a shadow nobody
  checked.
</docs>
