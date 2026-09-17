<script setup lang="ts">
/**
 * A themed dropdown, built on Reka UI's `Select` primitive rather than a bare `<select>` --
 * a native select falls back to the browser's own control chrome (not the app's tokens) the
 * moment it is left `bg-transparent` with no explicit text colour, which is exactly the bug
 * this component exists to stop recurring one call site at a time.
 *
 * All classes are written out in full, on purpose. The consuming app's Tailwind build scans
 * this package's compiled output for class names, so a class assembled from a variable would
 * never be found and would silently generate no CSS.
 */
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "reka-ui";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    placeholder: "",
    disabled: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const triggerClass =
  "flex w-full items-center justify-between gap-2 rounded-control border border-hairline " +
  "bg-surface px-2 py-1.5 text-body text-ink outline-none transition-colors " +
  "hover:not-disabled:bg-raised focus-visible:ring-2 focus-visible:ring-accent " +
  "disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted";

const contentClass =
  "z-50 max-h-[var(--reka-select-content-available-height)] " +
  "min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-control " +
  "border border-hairline bg-surface shadow-lg " +
  "data-[state=open]:animate-in data-[state=closed]:animate-out " +
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95";

const itemClass =
  "flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2 " +
  "text-body text-ink outline-none transition-colors data-[highlighted]:bg-raised " +
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";
</script>

<template>
  <SelectRoot
    :model-value="props.modelValue"
    :disabled="props.disabled"
    @update:model-value="(value) => emit('update:modelValue', String(value))"
  >
    <SelectTrigger :class="triggerClass">
      <SelectValue :placeholder="props.placeholder" />
      <SelectIcon class="text-muted" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent :class="contentClass" position="popper" :side-offset="4">
        <SelectViewport class="p-1">
          <SelectItem
            v-for="option in props.options"
            :key="option.value"
            :value="option.value"
            :disabled="option.disabled"
            :class="itemClass"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator>✓</SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
