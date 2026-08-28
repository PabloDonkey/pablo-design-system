<script setup lang="ts">
/**
 * A small, quiet marker. It reports one fact in one or two words.
 *
 * Three shapes, and the props pick between them rather than only restyling:
 *   plain                  a <span>. Reports a fact. Not focusable.
 *   interactive            a <button>. Pressing it does something.
 *   dismissible            a <span> holding an X button, so it can be removed.
 *
 * `interactive` and `dismissible` together give a <span> with TWO buttons in
 * it -- the label and the X. A button cannot be nested inside a button, so the
 * root has to step back to a span the moment an X exists.
 */

type Tone = "neutral" | "accent" | "warning" | "danger";

const props = withDefaults(
  defineProps<{
    tone?: Tone;
    /** Pressing the chip does something -- a filter that toggles, say. Renders
     *  a real button, so it is focusable and announced as pressable. Leave it
     *  off for a chip that only reports a fact, or every status marker on the
     *  page becomes a tab stop. */
    interactive?: boolean;
    /** Show an X that removes the chip. Emits `dismiss`. */
    dismissible?: boolean;
    /** The X's accessible name. A screen reader reads the button on its own,
     *  so "Remove" alone does not say what is being removed -- name the thing:
     *  `dismiss-label="Remove tag: noir"`. */
    dismissLabel?: string;
  }>(),
  { tone: "neutral", interactive: false, dismissible: false, dismissLabel: "Remove" },
);

const emit = defineEmits<{ dismiss: [] }>();

const base =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-control border " +
  "py-0.5 font-mono text-micro";

const tones: Record<Tone, string> = {
  neutral: "border-hairline text-muted",
  accent: "border-transparent bg-accent-soft text-accent",
  warning: "border-transparent bg-warning-soft text-warning",
  danger: "border-transparent bg-danger-soft text-danger",
};

const pressable = "transition-colors hover:border-hairline hover:text-ink";

// The X sits inside the chip's right padding, so the chip keeps its shape while
// giving the button a real hit area rather than a few pixels of glyph.
const dismissButton =
  "-mr-0.5 ml-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-control " +
  "opacity-60 transition-opacity hover:opacity-100";
</script>

<template>
  <!-- Dismissible: a span wrapper, because it has to contain a button. -->
  <span v-if="props.dismissible" :class="[base, tones[props.tone], 'pl-2 pr-1']">
    <button v-if="props.interactive" type="button" :class="pressable">
      <slot />
    </button>
    <span v-else><slot /></span>

    <button
      type="button"
      :class="dismissButton"
      :aria-label="props.dismissLabel"
      @click="emit('dismiss')"
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
    </button>
  </span>

  <!-- Not dismissible: the chip itself is the element. -->
  <component
    :is="props.interactive ? 'button' : 'span'"
    v-else
    :type="props.interactive ? 'button' : undefined"
    :class="[base, tones[props.tone], 'px-2', props.interactive ? pressable : '']"
  >
    <slot />
  </component>
</template>
