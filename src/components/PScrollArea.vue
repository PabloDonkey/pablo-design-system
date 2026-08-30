<script setup lang="ts">
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
 * caps at a fixed max-height). Vue's automatic attribute fallthrough handles that, since
 * `ScrollAreaRoot` is this component's only root element.
 */
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
</script>

<template>
  <ScrollAreaRoot type="hover" class="relative overflow-hidden">
    <ScrollAreaViewport class="h-full w-full" :class="viewportClass">
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
