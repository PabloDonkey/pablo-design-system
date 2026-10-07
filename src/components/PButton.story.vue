<script setup lang="ts">
import PButton from "./PButton.vue";

const variants = ["solid", "outline", "ghost"] as const;
const tones = ["neutral", "accent", "warning", "danger"] as const;
</script>

<template>
  <Story title="Primitives/PButton" :layout="{ type: 'grid', width: 420 }">
    <Variant v-for="variant in variants" :key="variant" :title="variant">
      <div class="flex flex-col gap-2 bg-ground p-4">
        <div v-for="tone in tones" :key="tone" class="flex flex-wrap items-center gap-2">
          <PButton :variant="variant" :tone="tone" size="sm">{{ tone }}</PButton>
          <PButton :variant="variant" :tone="tone">{{ tone }}</PButton>
          <PButton :variant="variant" :tone="tone" disabled>Disabled</PButton>
        </div>
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

## Two choices: variant and tone

A button has two props for its look. They are separate, so any style goes with any colour.

**`variant`** is the style. Pick by how loud the action must be.

| Variant | Looks like | Use it for |
|---|---|---|
| `solid` | Filled with the colour. | The one action the screen exists for. Send, Save, Create. **One per screen.** If two things are solid, neither stands out. |
| `outline` | A border and coloured text. The default. | Ordinary actions. Cancel, Export, Edit. |
| `ghost` | Text only, until hover. | Actions that must be available but should stay quiet. |

**`tone`** is the colour. Pick by what the action means. The names are the same as PChip's `tone`.

| Tone | Use it for |
|---|---|
| `neutral` | Most actions. The default. |
| `accent` | The main action, or an action that adds or keeps something. |
| `warning` | An action that changes something the user must check. |
| `danger` | Actions that destroy or cannot be undone. Delete, Retire, Block. Rare. |

`danger` is a promise, not a colour. Use it only when something is really lost. A button that
looks dangerous but is not teaches people to ignore the warning.

Common pairs:

| Old name | Now |
|---|---|
| `primary` | `variant="solid" tone="accent"` |
| `secondary` | the defaults: `variant="outline" tone="neutral"` |
| `danger` | `tone="danger"` (outline) |
| `ghost` | `variant="ghost"` |

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
