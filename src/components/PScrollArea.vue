<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
import {
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from "reka-ui";

/**
 * A scroll well with a subtle, cross-browser scrollbar: track and thumb only, no native end
 * buttons. Wraps Reka UI's `ScrollArea` rather than styling the native scrollbar, because
 * `::-webkit-scrollbar` has no Firefox equivalent, and neither lets a caller draw just a
 * track and thumb without the OS's own arrows on some platforms.
 *
 * The root does not own height: pass a sizing class the same way `PPanel` takes spacing --
 * "how tall" is a caller decision (rp-engine's transcript fills its flex parent; its composer
 * caps at a fixed max-height).
 *
 * This component has two DOM nodes a caller might reasonably want to reach, not one, so
 * automatic attribute fallthrough (which always targets a single root) is turned off and
 * split by hand: `class` sizes the root, the box that clips; everything else (`data-testid`,
 * `aria-label`, and the like) describes the scrollable region itself and goes on the
 * viewport -- the root's own `scrollHeight` never exceeds its `clientHeight` (its child is
 * pinned to `h-full`), so a test or a screen reader asking "is this actually scrolling" needs
 * the viewport, not the root.
 */
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    /**
     * `true` (default) reveals a thin track and thumb on hover or while scrolling, then
     * fades back out. `false` never renders one at all -- the area still scrolls, just with
     * no visible affordance, ever, for a spot where the affordance itself would be noise.
     * Which one applies where is a caller decision, not this component's to guess.
     */
    visible?: boolean;
    /** Class for the viewport, the actual scrolling element. Padding belongs here, not on
     *  the root, so it lands on the scrolling content instead of pushing the scrollbar
     *  (a sibling of the viewport, not its child) off to the side. */
    viewportClass?: string;
  }>(),
  {
    visible: true,
    viewportClass: "",
  },
);

/**
 * All classes are written out in full, on purpose. The consuming app's Tailwind build scans
 * this package's compiled output for class names, so a class assembled from a variable would
 * never be found and would silently generate no CSS.
 */
const scrollbarBase =
  "flex touch-none select-none rounded-full bg-hairline-soft transition-opacity duration-150 " +
  "data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100";

const thumbBase = "relative flex-1 rounded-full bg-hairline";

const attrs = useAttrs();
const viewportAttrs = computed(() => {
  const { class: _rootClass, ...rest } = attrs;
  return rest;
});

// Reka's `ScrollAreaRoot` already exposes `viewport`, the actual scrolling element, to code
// that imports Reka directly (its own docs call it out for exactly this: a caller that needs
// to read or drive scroll position). A caller of this component sees `PScrollArea`, not
// Reka, so the same element is re-exposed here under the same name -- rp-engine's transcript
// needs it to follow the newest turn.
//
// A getter, not a `computed`: `defineExpose` hands the parent this object as-is, and Vue's
// public-instance proxy auto-unwraps a top-level ref on read -- so `rootRef.value.viewport`
// is already the raw element (Reka's own `viewport` ref, unwrapped the same way), not
// something a caller must `.value` again. The getter still tracks correctly inside a
// caller's own `computed`, because Vue collects dependencies by which ref's `.value` is read
// during the active effect, not by which function reads it.
const rootRef = ref<{ viewport: HTMLElement | undefined } | null>(null);
defineExpose({
  get viewport(): HTMLElement | null {
    return rootRef.value?.viewport ?? null;
  },
});
</script>

<template>
  <ScrollAreaRoot
    ref="rootRef"
    type="hover"
    class="relative overflow-hidden"
    :class="attrs.class"
  >
    <ScrollAreaViewport v-bind="viewportAttrs" class="h-full w-full" :class="viewportClass">
      <slot />
    </ScrollAreaViewport>
    <template v-if="props.visible">
      <ScrollAreaScrollbar orientation="vertical" :class="[scrollbarBase, 'w-2 p-0.5']">
        <ScrollAreaThumb :class="thumbBase" />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar
        orientation="horizontal"
        :class="[scrollbarBase, 'h-2 flex-col p-0.5']"
      >
        <ScrollAreaThumb :class="thumbBase" />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner class="bg-hairline-soft" />
    </template>
  </ScrollAreaRoot>
</template>
