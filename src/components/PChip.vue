<script setup lang="ts">
/**
 * A small status marker: a turn number, a state, a filter that can be switched.
 *
 * `interactive` decides the element rather than only the styling. A chip you can
 * press must be a real button so it is reachable by keyboard and announced as
 * pressable; a chip that only reports a fact must not be.
 */

type Tone = "neutral" | "accent" | "warning" | "danger";

const props = withDefaults(
  defineProps<{
    tone?: Tone;
    interactive?: boolean;
  }>(),
  { tone: "neutral", interactive: false },
);

const base =
  "inline-flex items-center gap-1 whitespace-nowrap rounded-control border " +
  "px-2 py-0.5 font-mono text-micro";

const tones: Record<Tone, string> = {
  neutral: "border-hairline text-muted",
  accent: "border-transparent bg-accent-soft text-accent",
  warning: "border-transparent bg-warning-soft text-warning",
  danger: "border-transparent bg-danger-soft text-danger",
};

const pressable = "transition-colors hover:border-hairline hover:text-ink";
</script>

<template>
  <component
    :is="props.interactive ? 'button' : 'span'"
    :type="props.interactive ? 'button' : undefined"
    :class="[base, tones[props.tone], props.interactive ? pressable : '']"
  >
    <slot />
  </component>
</template>
