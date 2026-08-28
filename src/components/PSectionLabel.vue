<script setup lang="ts">
/**
 * The quiet uppercase heading that names a section.
 *
 * `as` exists because the right heading level depends on what already sits
 * above it on the page, and a design system cannot know that. It defaults to a
 * heading rather than a <span> so the common case is the accessible one.
 */

type Size = "sm" | "md";

const props = withDefaults(
  defineProps<{
    as?: "h2" | "h3" | "h4" | "span";
    size?: Size;
  }>(),
  { as: "h2", size: "md" },
);

const base = "font-semibold uppercase tracking-wide text-muted";

const sizes: Record<Size, string> = {
  sm: "text-micro",
  md: "text-body",
};
</script>

<template>
  <component :is="props.as" :class="[base, sizes[props.size]]">
    <slot />
  </component>
</template>
