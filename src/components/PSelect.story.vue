<script setup lang="ts">
import { ref } from "vue";
import PSelect from "./PSelect.vue";

const languageOptions = [
  { value: "auto", label: "Automatic" },
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

const withDisabled = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "beta", label: "Klingon (beta)", disabled: true },
];

const language = ref("auto");
const languageDisabled = ref("en");
const unselected = ref("");
</script>

<template>
  <Story title="Primitives/PSelect" :layout="{ type: 'grid', width: 320 }">
    <Variant title="Basic">
      <div class="flex flex-col gap-2 bg-ground p-4">
        <PSelect v-model="language" :options="languageOptions" />
        <span class="text-micro text-muted">Selected: {{ language }}</span>
      </div>
    </Variant>

    <Variant title="Placeholder, nothing selected">
      <div class="flex flex-col gap-2 bg-ground p-4">
        <PSelect v-model="unselected" :options="languageOptions" placeholder="Choose a language…" />
      </div>
    </Variant>

    <Variant title="Disabled option">
      <div class="flex flex-col gap-2 bg-ground p-4">
        <PSelect v-model="languageDisabled" :options="withDisabled" />
      </div>
    </Variant>

    <Variant title="Whole select disabled">
      <div class="flex flex-col gap-2 bg-ground p-4">
        <PSelect v-model="language" :options="languageOptions" disabled />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PSelect

A themed dropdown that wraps Reka UI's `Select`, in place of a bare `<select>`. A native
`<select>` left `bg-transparent` with no explicit text colour falls back to the browser's own
control chrome instead of the app's dark-mode tokens — that exact bug recurred at two call
sites in rp-engine before this component existed to fix it once.

## Usage

```vue
<PSelect v-model="language" :options="[{ value: 'en', label: 'English' }]" />
```

`v-model` carries the option's `value`, never its `label` — the same contract a native
`<select>`'s `v-model` has.

## Options

Each option is `{ value: string; label: string; disabled?: boolean }`. A disabled option stays
in the list (so the listbox does not reflow as options come and go) but cannot be picked.

## Placeholder

When `modelValue` does not match any option's `value` (typically `""`), the `placeholder` prop
shows in the trigger instead of a blank space.

## Keyboard navigation

Inherited from Reka UI's `Select`: **Enter/Space** opens it, **ArrowUp/ArrowDown** move between
options, **Enter** picks the highlighted one, **Escape** closes it and returns focus to the
trigger, and typing jumps to the first option starting with that letter.
</docs>
