<script setup lang="ts">
import { onMounted, ref } from "vue";

import PButton from "./PButton.vue";

/**
 * The light/dark switch. Every token in this package is already doubled for
 * both themes and reacts to `[data-theme]` on any element (see `tokens.css`),
 * so switching themes is one attribute write — this component's whole job is
 * deciding what that attribute should be and remembering the answer.
 *
 * Until a visitor clicks this, the page follows the operating system, exactly
 * as it did before this component existed — `localStorage` is read on mount,
 * and the `data-theme` attribute is written **only if a choice was actually
 * stored**. An unclicked toggle leaves the `@media (prefers-color-scheme)`
 * rule in `tokens.css` in charge.
 */

type Theme = "light" | "dark";

const STORAGE_KEY = "pablo-theme";

const theme = ref<Theme>("light");

function systemPrefersDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function readStored(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

onMounted(() => {
  const stored = readStored();
  theme.value = stored ?? (systemPrefersDark() ? "dark" : "light");
  if (stored) document.documentElement.dataset.theme = stored;
});

function toggle(): void {
  theme.value = theme.value === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme.value;
  localStorage.setItem(STORAGE_KEY, theme.value);
}
</script>

<template>
  <PButton
    variant="ghost"
    size="sm"
    :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <svg
      v-if="theme === 'dark'"
      viewBox="0 0 20 20"
      aria-hidden="true"
      class="size-4"
      fill="currentColor"
    >
      <path
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
      />
    </svg>
    <svg v-else viewBox="0 0 20 20" aria-hidden="true" class="size-4" fill="currentColor">
      <path
        d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm4.95 2.05a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 9a1 1 0 110 2h-1a1 1 0 110-2h1zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.95-2.05a1 1 0 010 1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zM4 9a1 1 0 110 2H3a1 1 0 110-2h1zm.757-4.95a1 1 0 011.414 0l.707.707A1 1 0 115.464 6.17l-.707-.707a1 1 0 010-1.414zM10 6a4 4 0 100 8 4 4 0 000-8z"
      />
    </svg>
  </PButton>
</template>
