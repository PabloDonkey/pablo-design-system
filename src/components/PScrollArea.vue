<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from "vue";
import {
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
 * "how tall" is a caller decision (rp-engine's transcript fills its flex parent).
 *
 * **The root needs a definite `height`, not a `max-height`, if it should ever actually
 * scroll.** The viewport inside is `height: 100%` of the root, and a percentage height
 * resolves against an *indeterminate* containing block (one sized by `max-height` alone, with
 * no explicit `height`) as `auto` -- so the viewport silently grows to match its content
 * instead of clipping it, and Reka never detects an overflow to scroll. For a fixed box this
 * is just `class="h-40"`; for a box that should grow with its content up to a cap (rp-engine's
 * composer, whose field grows with what is typed), the caller has to compute that clamp
 * itself and pass it as an explicit pixel `height` -- there is no way to express "auto, but
 * capped, and still let a percentage child measure overflow" in CSS alone.
 *
 * This component has two DOM nodes a caller might reasonably want to reach, not one, so
 * automatic attribute fallthrough (which always targets a single root) is turned off and
 * split by hand: `class` and `style` size the root, the box that clips; everything else
 * (`data-testid`, `aria-label`, and the like) describes the scrollable region itself and goes
 * on the viewport -- the root's own `scrollHeight` never exceeds its `clientHeight` (its
 * child is pinned to `h-full`), so a test or a screen reader asking "is this actually
 * scrolling" needs the viewport, not the root.
 *
 * **Visibility tracks proximity to the scrollbar, not the whole scroll area.** Reka's own
 * `type="hover"` reveals the scrollbar on hovering *anywhere* in the content, which is too
 * eager for a chat transcript -- reading the text shouldn't paint a scrollbar. This component
 * uses `type="always"` internally (Reka always mounts the scrollbar) and drives its opacity
 * itself, from the pointer's distance to the scrollbar's own bounding box, so it only
 * appears within `PROXIMITY_PX` of the strip itself (or while dragging its thumb).
 *
 * **Vertical only.** Neither current consumer needs horizontal scrolling (a chat transcript
 * and a wrapping text field both just wrap), and mounting a `ScrollAreaScrollbar` at all --
 * even an empty one, with nothing to scroll -- turns on that axis's `overflow: scroll` and
 * gives it a real, visible track. Add it back deliberately, behind a prop, when a real
 * consumer needs it -- guessing the shape now produces a prop nobody asked for.
 */
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    /**
     * `true` (default) reveals a thin track and thumb once the pointer is within
     * `PROXIMITY_PX` of the scrollbar (or dragging its thumb), then fades back out. `false`
     * never renders one at all -- the area still scrolls, just with no visible affordance,
     * ever, for a spot where the affordance itself would be noise. Which one applies where is
     * a caller decision, not this component's to guess.
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

/** How close the pointer must be to the scrollbar's own box before it fades in. */
const PROXIMITY_PX = 50;

/**
 * All classes are written out in full, on purpose. The consuming app's Tailwind build scans
 * this package's compiled output for class names, so a class assembled from a variable would
 * never be found and would silently generate no CSS.
 */
const scrollbarBase =
  "flex touch-none select-none rounded-full bg-hairline-soft opacity-0 transition-opacity duration-150";

// `bg-hairline` (the same token a 1px border uses) reads fine as a border -- a thin line
// gets its contrast from the edge, not the fill -- but disappears as a filled shape, which is
// what a thumb is. `bg-muted/50` (this component's first attempt) turned out to have the same
// problem one step removed: `muted` is a mid-tone grey, and at 50% alpha over a near-white
// ground the blended result is still pale enough to miss at a glance, not just on close
// inspection. `ink`, the darkest token, gives more contrast per unit of opacity.
const thumbBase = "relative flex-1 rounded-full bg-ink/25 transition-colors hover:bg-ink/40";

const attrs = useAttrs();
const viewportAttrs = computed(() => {
  const { class: _rootClass, style: _rootStyle, ...rest } = attrs;
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
const rootRef = ref<{ viewport: HTMLElement | undefined; $el?: HTMLElement } | null>(null);
defineExpose({
  get viewport(): HTMLElement | null {
    return rootRef.value?.viewport ?? null;
  },
});

// Proximity-based reveal. Queried by `[data-orientation]` rather than a template ref on
// `ScrollAreaScrollbar` itself: with `type="always"` that component dispatches internally to
// one of five different Reka implementations, and matching an attribute Reka already sets is
// more robust than chasing which one is live through the ref-forwarding chain.
const near = ref(false);
let dragging = false;

function distanceToRect(x: number, y: number, rect: DOMRect): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

function scrollbarRects(): DOMRect[] {
  const root = rootRef.value?.$el;
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>("[data-orientation]")).map((el) =>
    el.getBoundingClientRect(),
  );
}

function updateNear(x: number, y: number): void {
  if (dragging) {
    near.value = true;
    return;
  }
  near.value = scrollbarRects().some((rect) => distanceToRect(x, y, rect) <= PROXIMITY_PX);
}

function handlePointerMove(event: PointerEvent): void {
  updateNear(event.clientX, event.clientY);
}

function handlePointerDown(event: PointerEvent): void {
  // Only a press that actually starts on the scrollbar begins a drag -- an ordinary click
  // elsewhere on the page must not pin the scrollbar visible.
  if (!(event.target as HTMLElement | null)?.closest("[data-orientation]")) return;
  dragging = true;
  near.value = true;
}

function handlePointerUp(event: PointerEvent): void {
  if (!dragging) return;
  dragging = false;
  updateNear(event.clientX, event.clientY);
}

onMounted(() => {
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerdown", handlePointerDown, { passive: true });
  window.addEventListener("pointerup", handlePointerUp, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerdown", handlePointerDown);
  window.removeEventListener("pointerup", handlePointerUp);
});
</script>

<template>
  <ScrollAreaRoot
    ref="rootRef"
    type="always"
    class="relative overflow-hidden"
    :class="attrs.class"
    :style="attrs.style"
  >
    <ScrollAreaViewport v-bind="viewportAttrs" class="h-full w-full" :class="viewportClass">
      <slot />
    </ScrollAreaViewport>
    <template v-if="props.visible">
      <ScrollAreaScrollbar
        orientation="vertical"
        :class="[scrollbarBase, 'w-2 p-0.5']"
        :style="{ opacity: near ? 1 : 0 }"
      >
        <ScrollAreaThumb :class="thumbBase" />
      </ScrollAreaScrollbar>
    </template>
  </ScrollAreaRoot>
</template>
