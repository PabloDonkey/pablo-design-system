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

    <Variant title="as=&quot;label&quot; (file input trigger)">
      <div class="flex flex-wrap items-center gap-2 bg-ground p-4">
        <PButton as="label">
          Import JSON
          <input type="file" class="hidden" />
        </PButton>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PButton

The one button. Every clickable action uses it.

It replaced 32 hand-written `<button>` elements in the rp-engine admin panel, which between
them used eight different class strings to describe the same control.

## Which variant

Pick by **what the action does**, not by how you want it to look.

| Variant | Use it for | How many per screen |
|---|---|---|
| `primary` | The one action the screen exists for. Send, Save, Create. | **One.** If two things are primary, neither is. |
| `secondary` | Ordinary actions. Cancel, Export, Edit. | As many as you need. |
| `danger` | Actions that destroy or cannot be undone. Delete, Retire, Block. | Rare. |
| `ghost` | Actions that must be available but should stay quiet. | A few. |

`danger` is a promise, not a colour. Use it only when something is really lost. A button that
looks dangerous but is not teaches people to ignore the warning.

## Sizes

`md` is the default and is almost always right. Use `sm` only inside a dense row — a table
cell, a message header, a chip strip — where a normal button would crowd its neighbours.

## Things it does for you

- **`type="button"` by default.** A bare `<button>` inside a `<form>` submits it. That is a
  real bug, and it is silent until someone presses Enter in a text field.
- **Disabled is handled once.** It sets `disabled`, fades the button, blocks the pointer, and
  stops hover styling. You do not add classes for it.
- **Focus is visible**, in both themes, from the package's base layer.

## `as="label"`

A native file input's trigger must be a real `<label>` wrapping the `<input>` -- a `<button>`
cannot do this job. `disabled` still greys it out, but only visually: a `<label>` has no
native disabled state, so disable the `<input>` inside it too, or the control looks inert
but isn't.

## Do not

- Do not use it for navigation. A thing that goes somewhere is a link, so a screen reader
  announces it correctly and middle-click opens a tab. Style a `RouterLink` instead.
- Do not disable a button without saying why. A greyed control with no reason beside it is a
  dead end. Put the reason next to it.
</docs>
