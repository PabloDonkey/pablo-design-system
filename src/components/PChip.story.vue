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
  </Story>
</template>

<docs lang="md">
# PChip

A small, quiet marker. It reports one fact in one or two words.

Chips are set in the monospace face, because most of what they hold is data: a turn number,
an identifier, a state, a count.

## Which tone

| Tone | Means |
|---|---|
| `neutral` | A plain fact. A turn number, a language code, a count. The default, and the common case. |
| `accent` | This one is current, selected, or live. |
| `warning` | Needs attention at some point. Not broken. |
| `danger` | Broken, blocked, or failed. |

Most chips are `neutral`. If every chip on the screen is coloured, the colour has stopped
meaning anything.

## `interactive` changes the element, not the styling

This is the part worth reading twice.

- `interactive` off renders a `<span>`. It reports a fact. It is not focusable, and keyboard
  users tab straight past it.
- `interactive` on renders a real `<button>` with `type="button"`. It is focusable and a
  screen reader announces it as pressable.

Use `interactive` **only when pressing the chip does something** — a filter that toggles, a
tag you can remove. If you turn it on for appearance, every status marker on the page becomes
a tab stop, and reaching the real controls means tabbing through all of them.

## Do not

- Do not put a sentence in a chip. If it wraps, it wants to be text.
- Do not use a chip as a button. If it is a real action with a verb, use `PButton`.
</docs>
