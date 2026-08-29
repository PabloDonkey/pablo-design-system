<script setup lang="ts">
/**
 * A row of named panels, one open at a time.
 *
 * Not an ARIA tablist: a tablist always keeps exactly one tab selected and
 * moves between them with arrow keys. This is a row of disclosure buttons
 * that happen to sit together — clicking the open one closes it, so "nothing
 * open" is a real state, not an omission. `aria-expanded` says so; `role="tab"`
 * would promise keyboard behaviour this does not implement.
 *
 * Controlled, not stateful: every click is emitted as-is. The caller decides
 * whether clicking the open tab closes it (pass the same id back to close, a
 * different one to switch) — see rp-engine's `SessionDetailPage` for the
 * close-on-repeat-click wiring this was built for.
 */

export interface TabItem {
  /** Stable identity. The label can carry a live value without changing what is selected. */
  id: string;
  label: string;
  /** Optional short text after the label, muted — a live summary of what opening this tab reveals. */
  summary?: string;
}

const props = defineProps<{
  tabs: TabItem[];
  /** The open tab's id, or null if none is open. */
  modelValue: string | null;
}>();

const emit = defineEmits<{
  /** Fired with the clicked tab's id, even when it is already open — the caller decides
   *  whether that closes it. */
  "update:modelValue": [id: string];
}>();
</script>

<template>
  <div class="inline-flex flex-wrap gap-1 rounded-control bg-raised p-1">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      type="button"
      class="flex items-center gap-1.5 rounded-control px-3 py-1 text-micro font-medium transition-colors"
      :class="
        props.modelValue === tab.id
          ? 'bg-surface text-ink shadow-raised'
          : 'text-muted hover:text-ink'
      "
      :aria-expanded="props.modelValue === tab.id"
      @click="emit('update:modelValue', tab.id)"
    >
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.summary"
        class="max-w-[13rem] truncate"
        :class="props.modelValue === tab.id ? 'text-muted' : 'text-faint'"
      >
        {{ tab.summary }}
      </span>
    </button>
  </div>
</template>
