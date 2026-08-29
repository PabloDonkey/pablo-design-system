<script setup lang="ts">
import PThemeToggle from "./PThemeToggle.vue";
</script>

<template>
  <Story title="Primitives/PThemeToggle" :layout="{ type: 'grid', width: 200 }">
    <Variant title="default">
      <div class="flex items-center gap-2 bg-ground p-4">
        <PThemeToggle />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PThemeToggle

The light/dark switch. Drop it in a navbar; it needs no props and no surrounding state.

## How it decides

Every token in this package is already doubled for both themes and reacts to `[data-theme]`
on any element, so switching themes is one attribute write. Until a visitor clicks this
button, the page follows the operating system exactly as it did before — `localStorage` is
read on mount, and `data-theme` is written on `document.documentElement` **only if a choice
was actually stored**. Clicking commits to an explicit choice from then on.

## Where the attribute lands

Always `document.documentElement` (the `<html>` element) — a whole-page toggle, not a
subtree re-theme. `tokens.css` also matches `[data-theme]` on any element, so a page that
wants to force a light section inside a dark app (or vice versa) can still set the attribute
locally; this component only ever does the whole-page case.
</docs>
