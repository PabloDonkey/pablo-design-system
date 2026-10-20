<script setup lang="ts">
/**
 * An on and off switch with a visible label.
 *
 * Built on Reka UI's `Switch` primitive. It renders a `<button role="switch">` with
 * `aria-checked`, so Space toggles it natively and Reka adds Enter. A `<button>` with
 * `disabled` blocks both keys and clicks.
 *
 * Controlled: the switch shows `modelValue` and emits the new value. Use `v-model`.
 *
 * All classes are written out in full, on purpose. The consuming app's Tailwind build scans
 * this package's compiled output for class names, so a class assembled from a variable would
 * never be found and would silently generate no CSS.
 */
import { SwitchRoot, SwitchThumb } from "reka-ui";
import { useId } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    /** The visible text beside the switch. It is also the switch's accessible name. */
    label: string;
    disabled?: boolean;
  }>(),
  { disabled: false },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const id = useId();
</script>

<template>
  <span class="inline-flex items-center gap-2" :class="props.disabled ? 'opacity-50' : ''">
    <SwitchRoot
      :id="id"
      :model-value="props.modelValue"
      :disabled="props.disabled"
      class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-hairline bg-raised p-0.5 transition-colors data-[state=checked]:border-accent data-[state=checked]:bg-accent disabled:cursor-not-allowed"
      @update:model-value="emit('update:modelValue', $event)"
    >
      <SwitchThumb
        class="block size-3.5 rounded-full bg-muted shadow-raised transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-accent-contrast"
      />
    </SwitchRoot>
    <label
      :for="id"
      class="select-none text-body text-ink"
      :class="props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
    >
      {{ props.label }}
    </label>
  </span>
</template>
