<script setup lang="ts">
import { ref } from "vue";

import PSwitch from "./PSwitch.vue";

const padPastEdges = ref(false);
</script>

<template>
  <Story title="Primitives/PSwitch" :layout="{ type: 'grid', width: 320 }">
    <Variant title="interactive">
      <div class="flex flex-col gap-2 bg-ground p-4">
        <PSwitch v-model="padPastEdges" label="Pad past edges" />
        <p class="text-meta text-muted">Value: {{ padPastEdges }}</p>
      </div>
    </Variant>

    <Variant title="on, off, disabled">
      <div class="flex flex-col gap-3 bg-ground p-4">
        <PSwitch :model-value="true" label="On" />
        <PSwitch :model-value="false" label="Off" />
        <PSwitch :model-value="true" label="Disabled on" disabled />
        <PSwitch :model-value="false" label="Disabled off" disabled />
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PSwitch

An on and off switch with a visible label. Use it for a setting that takes effect at once,
for example "Pad past edges". For an action, use `PButton`.

## Props

| Prop         | Type      | Default | What it does                                                   |
| ------------ | --------- | ------- | -------------------------------------------------------------- |
| `modelValue` | `boolean` | —       | On or off. Required.                                           |
| `label`      | `string`  | —       | The text beside the switch. It is also the accessible name.    |
| `disabled`   | `boolean` | `false` | Blocks clicks and the keyboard. The switch and label grey out. |

## Event

`update:modelValue` sends the new value, so `v-model` works:

```vue
<PSwitch v-model="padPastEdges" label="Pad past edges" />
```

## Accessibility

The switch is a `<button role="switch">` with `aria-checked`. Space and Enter change the
value. A click on the label also changes the value.
</docs>
