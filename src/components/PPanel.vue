<script setup lang="ts">
/**
 * The bordered box every block on every page sits in.
 *
 * It owns the surface, the radius, the hairline and the text colour -- the
 * things that must match across every page. It does NOT own spacing: pass a
 * Tailwind class for that, which gives you the whole scale and responsive
 * variants rather than a handful of steps someone picked in advance.
 *
 *   <PPanel class="p-4">                ordinary block
 *   <PPanel>                            a divided list, rows bring their own padding
 *   <PPanel class="p-3 md:p-6">         responsive, which a prop could not do
 *
 * Vue merges a passed `class` with the classes below, so this just works.
 */

const props = withDefaults(
  defineProps<{
    /** Drop the hairline. For a panel on a contrasting ground, or one already
     *  separated by a tint or its own shadow, where a border would be a second
     *  signal saying the same thing. */
    borderless?: boolean;
    /** Lift the panel off the page. `raised` for something that sits slightly
     *  proud, `floating` for something detached, such as a menu over content.
     *  Not a way to separate one inline block from another -- that is the
     *  hairline's job. */
    shadow?: "none" | "raised" | "floating";
  }>(),
  { borderless: false, shadow: "none" },
);

// `text-ink` is deliberate. A component that paints a background must paint its
// foreground too, or it inherits whatever colour the host page happens to set
// and becomes unreadable on someone else's surface.
const base = "rounded-panel bg-surface text-ink text-body";

const shadows: Record<"none" | "raised" | "floating", string> = {
  none: "",
  raised: "shadow-raised",
  floating: "shadow-floating",
};
</script>

<template>
  <div :class="[base, props.borderless ? '' : 'border border-hairline', shadows[props.shadow]]">
    <slot />
  </div>
</template>
