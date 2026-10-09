<script setup lang="ts">
/**
 * One toast: a short message with a close button and an optional action.
 *
 * Most code does not use this directly. Call `useToast().show(...)` and mount one
 * `PToastViewport`. Use `PToast` itself only inside a `ToastProvider`, for example when you
 * build your own list.
 *
 * Every class string below is written out in full, on purpose. See `PButton`.
 */

import { ToastAction, ToastClose, ToastDescription, ToastRoot } from "reka-ui";

import PButton from "./PButton.vue";
import { DEFAULT_DURATION } from "./useToast";
import type { ToastTone } from "./useToast";

const props = withDefaults(
  defineProps<{
    tone?: ToastTone;
    /** The open state. Use `v-model:open`. */
    open?: boolean;
    /** Milliseconds before it closes. 0 keeps it open until closed. */
    duration?: number;
    /** The text of the action button. The button shows only when this is set. */
    actionLabel?: string;
    /** The accessible name of the close button. */
    closeLabel?: string;
  }>(),
  {
    tone: "neutral",
    open: true,
    duration: DEFAULT_DURATION,
    actionLabel: undefined,
    closeLabel: "Close",
  },
);

const emit = defineEmits<{
  "update:open": [open: boolean];
  /** The action button was pressed. The toast closes after this. */
  action: [];
}>();

const base =
  "pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-panel border " +
  "border-l-4 bg-surface px-3 py-2 text-body text-ink shadow-floating " +
  "motion-safe:data-[state=open]:animate-toast-in " +
  "motion-safe:data-[state=closed]:animate-toast-out " +
  "motion-safe:data-[swipe=end]:animate-none " +
  "data-[swipe=move]:translate-y-[var(--reka-toast-swipe-move-y)]";

const toneClasses: Record<ToastTone, string> = {
  neutral: "border-hairline border-l-muted",
  success: "border-hairline border-l-accent",
  danger: "border-hairline border-l-danger",
};

// The action button uses the same tone names as `PButton`. `success` is the accent.
const actionTone = { neutral: "neutral", success: "accent", danger: "danger" } as const;

function onAction(): void {
  emit("action");
  emit("update:open", false);
}
</script>

<template>
  <!-- A danger toast is an alert. The others are status messages. Reka also writes the
       text into a hidden live region, so the message is announced either way. -->
  <ToastRoot
    :open="props.open"
    :duration="props.duration"
    :type="props.tone === 'danger' ? 'foreground' : 'background'"
    :role="props.tone === 'danger' ? 'alert' : 'status'"
    :data-tone="props.tone"
    :class="[base, toneClasses[props.tone]]"
    @update:open="(value: boolean) => emit('update:open', value)"
  >
    <ToastDescription class="min-w-0 flex-1 text-meta">
      <slot />
    </ToastDescription>

    <ToastAction v-if="props.actionLabel" as-child :alt-text="props.actionLabel">
      <PButton size="sm" :tone="actionTone[props.tone]" @click="onAction">
        {{ props.actionLabel }}
      </PButton>
    </ToastAction>

    <ToastClose
      :aria-label="props.closeLabel"
      class="inline-flex size-6 shrink-0 items-center justify-center rounded-control text-muted transition-colors hover:bg-raised hover:text-ink"
    >
      <svg viewBox="0 0 10 10" aria-hidden="true" class="size-2.5">
        <path
          d="M1 1l8 8M9 1l-8 8"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          fill="none"
        />
      </svg>
    </ToastClose>
  </ToastRoot>
</template>
