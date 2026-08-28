<script setup lang="ts">
/**
 * The bordered box every block on every page sits in.
 *
 * Three things are adjustable, and each answers a different question:
 *   flush      - does the child manage its own spacing?
 *   borderless - is this block already separated by something else?
 *   shadow     - is this floating above the page, rather than part of it?
 */

type Shadow = "none" | "raised" | "floating";

const props = withDefaults(
  defineProps<{
    /** Turn the padding off when the child manages its own spacing. */
    flush?: boolean;
    /** Drop the hairline. For a panel on a contrasting ground, or one already
     *  separated by a tint, where a border would be a second signal saying the
     *  same thing. */
    borderless?: boolean;
    /** Lift the panel off the page. `raised` for something that sits slightly
     *  proud, `floating` for something detached, such as a menu over content.
     *  Not a way to separate one inline block from another -- that is the
     *  hairline's job. */
    shadow?: Shadow;
  }>(),
  { flush: false, borderless: false, shadow: "none" },
);

const base = "rounded-panel bg-surface text-body";

const shadows: Record<Shadow, string> = {
  none: "",
  raised: "shadow-raised",
  floating: "shadow-floating",
};
</script>

<template>
  <div
    :class="[
      base,
      props.flush ? '' : 'p-3',
      props.borderless ? '' : 'border border-hairline',
      shadows[props.shadow],
    ]"
  >
    <slot />
  </div>
</template>
