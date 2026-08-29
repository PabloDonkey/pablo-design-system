<script setup lang="ts">
import { ref } from "vue";

import PTabs from "./PTabs.vue";

const tabs = [
  { id: "persona", label: "Persona", summary: "Mira Vance" },
  { id: "memory", label: "Memory", summary: "38% of the window" },
  { id: "directives", label: "Directives" },
];

const open = ref<string | null>("memory");
function onSelect(id: string): void {
  open.value = open.value === id ? null : id;
}
</script>

<template>
  <Story title="Primitives/PTabs" :layout="{ type: 'grid', width: 420 }">
    <Variant title="interactive">
      <div class="bg-ground p-4">
        <PTabs :tabs="tabs" :model-value="open" @update:model-value="onSelect" />
      </div>
    </Variant>

    <Variant title="none open">
      <div class="bg-ground p-4">
        <PTabs :tabs="tabs" :model-value="null" />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PTabs

A row of named panels, one open at a time — built for `rp-engine`'s Persona/Memory/
Directives selector, which needed one compact row instead of three stacked cards.

## Not an ARIA tablist

A tablist always keeps exactly one tab selected and moves between tabs with arrow keys.
`PTabs` is a row of disclosure buttons that happen to sit together: clicking the open one
closes it, so "nothing open" is a real state. `aria-expanded` says that; `role="tab"` would
promise keyboard behaviour this does not implement.

## Controlled, not stateful

`PTabs` never decides what "select" means — it emits the clicked id, every time, even for
the tab that is already open. The caller decides:

```ts
function onSelect(id: string): void {
  open.value = open.value === id ? null : id; // click the open one again to close it
}
```

## `summary`

Optional, muted text after the label — a live value the panel is about to show, so the row
works as a glance-level status line even before anything is opened.
</docs>
