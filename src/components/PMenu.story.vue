<script setup lang="ts">
import { ref } from "vue";
import PButton from "./PButton.vue";
import PMenu from "./PMenu.vue";

const basicItems = [
  { label: "Edit scenario", value: "edit" },
  { label: "Duplicate scenario", value: "duplicate" },
  { label: "Export", value: "export" },
];

const itemsWithDisabled = [
  { label: "Edit scenario", value: "edit" },
  { label: "Duplicate scenario", value: "duplicate" },
  {
    label: "Delete scenario",
    value: "delete",
    disabledReason: "Cannot delete the default scenario",
  },
  { label: "Export", value: "export" },
];

const itemsWithHint = [
  { label: "Save", value: "save", hint: "Ctrl+S" },
  { label: "Save as", value: "save-as", hint: "Ctrl+Shift+S" },
  { label: "Auto-save", value: "auto-save", hint: "Enabled" },
];

const selectedEdit = ref<string>();
const selectedDisabled = ref<string>();
const selectedHint = ref<string>();
</script>

<template>
  <Story title="Primitives/PMenu" :layout="{ type: 'grid', width: 420 }">
    <!-- Basic menu with three items -->
    <Variant title="Basic">
      <div class="flex flex-col gap-4 bg-ground p-4">
        <div class="flex items-center gap-2">
          <PMenu :items="basicItems" @select="(v) => (selectedEdit = v)">
            <PButton variant="secondary">Actions ▾</PButton>
          </PMenu>
          <span v-if="selectedEdit" class="text-micro text-muted">Selected: {{ selectedEdit }}</span>
        </div>
      </div>
    </Variant>

    <!-- Menu with disabled item showing reason -->
    <Variant title="Disabled item with reason">
      <div class="flex flex-col gap-4 bg-ground p-4">
        <p class="text-micro text-muted">
          The "Delete scenario" item is disabled. Hover over it to see the reason beside the label.
        </p>
        <div class="flex items-center gap-2">
          <PMenu :items="itemsWithDisabled" @select="(v) => (selectedDisabled = v)">
            <PButton variant="secondary">Scenario ▾</PButton>
          </PMenu>
          <span v-if="selectedDisabled" class="text-micro text-muted">
            Selected: {{ selectedDisabled }}
          </span>
        </div>
      </div>
    </Variant>

    <!-- Menu with hint text -->
    <Variant title="Items with hints">
      <div class="flex flex-col gap-4 bg-ground p-4">
        <div class="flex items-center gap-2">
          <PMenu :items="itemsWithHint" @select="(v) => (selectedHint = v)">
            <PButton variant="secondary">File ▾</PButton>
          </PMenu>
          <span v-if="selectedHint" class="text-micro text-muted">Selected: {{ selectedHint }}</span>
        </div>
      </div>
    </Variant>

    <!-- Primary button trigger -->
    <Variant title="Primary trigger">
      <div class="flex items-center gap-2 bg-ground p-4">
        <PMenu :items="basicItems" @select="selectedEdit = $event">
          <PButton variant="primary">Send ▾</PButton>
        </PMenu>
      </div>
    </Variant>

    <!-- Ghost button trigger -->
    <Variant title="Ghost trigger">
      <div class="flex items-center gap-2 bg-ground p-4">
        <PMenu :items="basicItems" @select="selectedEdit = $event">
          <PButton variant="ghost">More ▾</PButton>
        </PMenu>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PMenu

A dropdown menu that wraps Reka UI's `DropdownMenu`, providing accessible navigation, keyboard
support, and typeahead.

## Keyboard navigation

- **Click** the trigger to open the menu.
- **ArrowUp/ArrowDown** navigate between enabled items. Disabled items are skipped.
- **Enter** or **Space** select the highlighted item.
- **Escape** closes the menu and returns focus to the trigger.
- **Home/End** jump to first/last enabled item.
- **Typeahead**: Start typing to jump to the first item matching that letter.

## Disabled items

Disabled items are shown with a reason beside the label, not hidden. This keeps the menu height
stable as you navigate, so items do not move under your finger between opens.

```ts
const items = [
  { label: "Edit", value: "edit" },
  { label: "Delete", value: "delete", disabledReason: "Cannot delete the default scenario" },
];
```

## Hints

Use the `hint` property to show keyboard shortcuts or state:

```ts
const items = [
  { label: "Save", value: "save", hint: "Ctrl+S" },
  { label: "Auto-save", value: "auto-save", hint: "Enabled" },
];
```

## Events

**`select`** — Fired when an enabled item is clicked or activated with Enter/Space.

```ts
@select="(value) => handleMenuSelect(value)"
```

The emitted value is the item's `value` property if provided, otherwise the `label`.

## CSS customization

PMenu uses `[data-state]` (open/closed) and `[data-disabled]` for styling. It does not add new
tokens; all styling uses existing design tokens.
</docs>
