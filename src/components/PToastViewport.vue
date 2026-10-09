<script setup lang="ts">
/**
 * The place where toasts show. Mount it once, near the root of the app:
 *
 * ```vue
 * <PToastViewport />
 * ```
 *
 * Then show toasts from any code with `useToast().show(...)`.
 *
 * The viewport is fixed to the bottom of the screen and stays compact. An app with a pinned
 * action bar sets `offset` to lift it. The viewport also reads the CSS variable
 * `--p-toast-offset`, so the offset can come from a stylesheet.
 */

import { ToastProvider, ToastViewport } from "reka-ui";

import PToast from "./PToast.vue";
import { useToast } from "./useToast";

const props = withDefaults(
  defineProps<{
    /** The gap between the bottom of the screen and the stack. Any CSS length. */
    offset?: string;
    /** The accessible name of the region. */
    label?: string;
  }>(),
  { offset: "1rem", label: "Notifications" },
);

const { toasts, close } = useToast();
</script>

<template>
  <ToastProvider swipe-direction="down" :duration="5000" :label="props.label">
    <PToast
      v-for="item in toasts"
      :key="item.id"
      :tone="item.tone"
      :open="item.open"
      :duration="item.duration"
      :action-label="item.action?.label"
      @update:open="(open) => !open && close(item.id)"
      @action="item.action?.onClick()"
    >
      {{ item.text }}
    </PToast>

    <!-- `pointer-events-none` lets clicks pass through the gaps. Each toast turns them back
         on for itself. -->
    <ToastViewport
      :label="`${props.label} ({hotkey})`"
      :style="{ '--p-toast-offset': props.offset }"
      class="pointer-events-none fixed inset-x-0 bottom-[var(--p-toast-offset,1rem)] z-50 m-0 flex list-none flex-col items-center gap-2 px-4 outline-none"
    />
  </ToastProvider>
</template>
