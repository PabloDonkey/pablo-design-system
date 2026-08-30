import { defineComponent, h, ref } from "vue";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";

import PScrollArea from "./PScrollArea.vue";

const tallContent = '<div style="height: 400px">tall content</div>';

test("renders what it is given", async () => {
  const screen = render(PScrollArea, { slots: { default: "Turn 12" } });

  await expect.element(screen.getByText("Turn 12")).toBeVisible();
});

/**
 * The default is Reka's own `type="hover"`: no scrollbar exists in the DOM at all until the
 * pointer enters the area. This is the "subtle" behaviour the caller usually wants, and it
 * comes from Reka rather than anything this component adds.
 */
test("the scrollbar is absent until the pointer enters the area, then appears", async () => {
  const screen = render(PScrollArea, {
    attrs: { class: "h-24" },
    slots: { default: tallContent },
  });
  const area = screen.container.firstElementChild as HTMLElement;

  expect(area.querySelector('[data-orientation="vertical"]')).toBeNull();

  await userEvent.hover(area);

  await expect
    .poll(() => area.querySelector('[data-orientation="vertical"]'))
    .not.toBeNull();
});

/**
 * `visible: false` is the escape hatch rp-engine's composer needs: a spot where any visible
 * scrollbar, even one that only appears on hover, would be noise. The area must still scroll
 * -- it is just never drawn.
 */
test("visible: false never renders a scrollbar, even while hovered", async () => {
  const screen = render(PScrollArea, {
    props: { visible: false },
    attrs: { class: "h-24" },
    slots: { default: tallContent },
  });
  const area = screen.container.firstElementChild as HTMLElement;

  await userEvent.hover(area);

  expect(area.querySelector('[data-orientation="vertical"]')).toBeNull();
});

test("visible: false still lets the content scroll", async () => {
  const screen = render(PScrollArea, {
    props: { visible: false },
    attrs: { class: "h-24" },
    slots: { default: tallContent },
  });
  const viewport = screen.container.querySelector(
    "[data-reka-scroll-area-viewport]",
  ) as HTMLElement;

  viewport.scrollTop = 100;

  expect(viewport.scrollTop).toBeGreaterThan(0);
});

/**
 * A caller that follows scroll position (rp-engine's transcript, staying on the newest turn)
 * needs the real scrolling element, not the root or the viewport wrapper -- Reka's own
 * `ScrollAreaRoot` exposes exactly this under the same name, and this component re-exposes it
 * for a caller that only knows `PScrollArea`, not Reka.
 */
test("exposes the real scrolling element as `viewport`", async () => {
  const areaRef = ref<InstanceType<typeof PScrollArea> | null>(null);
  const Host = defineComponent({
    setup() {
      return () =>
        h(PScrollArea, { ref: areaRef, class: "h-24" }, { default: () => h("div", { style: "height: 400px" }, "tall") });
    },
  });

  render(Host);

  await expect.poll(() => areaRef.value?.viewport ?? null).not.toBeNull();
  const viewport = areaRef.value!.viewport!;
  expect(viewport.hasAttribute("data-reka-scroll-area-viewport")).toBe(true);

  viewport.scrollTop = 50;
  expect(viewport.scrollTop).toBeGreaterThan(0);
});

/**
 * `class` and every other attribute go to different DOM nodes: the root's own `scrollHeight`
 * never exceeds its `clientHeight` (its child is pinned to `h-full`), so a consumer test
 * asking "is this element actually the one scrolling" -- rp-engine's does, by `data-testid`
 * -- needs the answer to come from the viewport, not the root.
 */
test("class sizes the root; other attributes (data-testid) land on the viewport", async () => {
  const screen = render(PScrollArea, {
    attrs: { class: "h-24", "data-testid": "well" },
    slots: { default: tallContent },
  });
  const root = screen.container.firstElementChild as HTMLElement;

  expect(root.getAttribute("data-testid")).toBeNull();
  expect(getComputedStyle(root).position).toBe("relative");

  const testIdEl = screen.getByTestId("well").element();
  expect(testIdEl.hasAttribute("data-reka-scroll-area-viewport")).toBe(true);
  expect(testIdEl.scrollHeight).toBeGreaterThan(testIdEl.clientHeight);
});

/**
 * `style` follows the same split as `class` -- rp-engine's composer needs an inline `height`
 * on the box that clips (see the test below for why it must be `height` and not `max-height`),
 * computed from a shared JS constant, which a Tailwind arbitrary class cannot express (a class
 * built from a variable is invisible to Tailwind's static scan).
 */
test("style sizes the root, same as class", async () => {
  const screen = render(PScrollArea, {
    attrs: { style: "height: 96px" },
    slots: { default: tallContent },
  });
  const root = screen.container.firstElementChild as HTMLElement;

  expect(getComputedStyle(root).height).toBe("96px");
});

/**
 * The single most likely way to misuse this component: `max-h-24` looks like the right class
 * for "cap the height, then scroll." It clips visually, because the root still has
 * `overflow: hidden` -- so a glance says it works. It does not actually scroll, because the
 * viewport inside is `height: 100%` of the root, and a percentage height resolves against an
 * *indeterminate* containing block (`max-height` alone, no explicit `height`) as `auto` --
 * so the viewport just grows past the cap instead of clipping and tracks no overflow. A real
 * `height` is the only thing that works, which is what the sibling test right above proves.
 */
test("max-height alone does not make the viewport scroll (documents the trap, doesn't endorse it)", async () => {
  const screen = render(PScrollArea, {
    attrs: { style: "max-height: 96px" },
    slots: { default: tallContent },
  });
  const viewport = screen.container.querySelector(
    "[data-reka-scroll-area-viewport]",
  ) as HTMLElement;

  expect(viewport.scrollHeight).toBe(viewport.clientHeight);
});
