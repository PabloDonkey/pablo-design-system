<script setup lang="ts">
import { ref } from "vue";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "reka-ui";
import type { DropdownMenuItemProps } from "reka-ui";

export interface MenuItem extends Omit<DropdownMenuItemProps, "disabled"> {
  /** Item label, shown to all users. */
  label: string;
  /** Optional reason why the item is disabled. If provided, item is disabled and reason is shown beside the label. */
  disabledReason?: string;
  /** Optional value to emit on select. Defaults to label. */
  value?: string;
  /** Optional text shown after the label. */
  hint?: string;
}

const props = withDefaults(
  defineProps<{
    /** Array of menu items. */
    items: MenuItem[];
    /** Optional CSS class for the trigger button. */
    triggerClass?: string;
    /** Optional CSS class for the content container. */
    contentClass?: string;
  }>(),
  {
    triggerClass: "",
    contentClass: "",
  },
);

const emit = defineEmits<{
  /** Fired when an item is selected. Emits the item's value (or label if no value). */
  select: [value: string];
}>();

const isOpen = ref(false);

/**
 * All classes are written out in full, on purpose. The consuming app's Tailwind
 * build scans this package's compiled output for class names, so a class
 * assembled from a variable would never be found and would silently generate no CSS.
 */
const contentBase =
  "z-50 min-w-48 rounded-control border border-hairline bg-surface shadow-lg " +
  "data-[state=open]:animate-in data-[state=closed]:animate-out " +
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 " +
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 " +
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 " +
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2";

const itemBase =
  "flex cursor-pointer select-none items-center justify-between gap-2 " +
  "px-3 py-2 outline-none transition-colors " +
  "data-[highlighted]:bg-raised data-[highlighted]:text-ink " +
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

const handleSelect = (value: string) => {
  emit("select", value);
  isOpen.value = false;
};
</script>

<template>
  <DropdownMenuRoot :open="isOpen" @update:open="(o) => (isOpen = o)">
    <DropdownMenuTrigger>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent :class="[contentBase, contentClass]" :side-offset="8">
        <template v-for="item in items" :key="item.label">
          <DropdownMenuItem
            :disabled="!!item.disabledReason"
            :class="itemBase"
            @select="handleSelect(item.value || item.label)"
          >
            <div class="flex flex-col gap-0.5">
              <span class="text-body font-medium">{{ item.label }}</span>
              <span v-if="item.disabledReason" class="text-micro text-muted">
                {{ item.disabledReason }}
              </span>
            </div>
            <span v-if="item.hint" class="text-micro text-muted">{{ item.hint }}</span>
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

