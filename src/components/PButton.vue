<script setup lang="ts">
/**
 * The one button.
 *
 * Every class string below is written out in full, on purpose. The consuming
 * app's Tailwind build scans this package's compiled output for class names, so
 * a class assembled from a variable -- `text-${tone}-500` -- would never be
 * found and would silently generate no CSS.
 */

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    /** Defaults to "button". A bare <button> inside a <form> submits it. */
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    /**
     * Render a `<label>` instead of a `<button>` -- for a native file input's
     * trigger, which must be a `<label>` wrapping the `<input>` to work. A
     * `<label>` has no native disabled state, so `disabled` only greys this
     * one out visually; the caller is still responsible for disabling
     * whatever the label wraps (the `<input>` itself).
     */
    as?: "button" | "label";
  }>(),
  { variant: "secondary", size: "md", type: "button", disabled: false, as: "button" },
);

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-control font-medium " +
  "transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-contrast hover:not-disabled:opacity-90",
  secondary: "border border-hairline bg-surface text-ink hover:not-disabled:bg-raised",
  danger: "border border-danger text-danger hover:not-disabled:bg-danger-soft",
  ghost: "text-muted hover:not-disabled:bg-raised hover:not-disabled:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "px-2.5 py-1 text-micro",
  md: "px-3 py-1.5 text-body",
};
</script>

<template>
  <button
    v-if="props.as === 'button'"
    :type="props.type"
    :disabled="props.disabled"
    :class="[
      base,
      'disabled:cursor-not-allowed disabled:opacity-50',
      variants[props.variant],
      sizes[props.size],
    ]"
  >
    <slot />
  </button>
  <label
    v-else
    :class="[
      base,
      props.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      variants[props.variant],
      sizes[props.size],
    ]"
  >
    <slot />
  </label>
</template>
