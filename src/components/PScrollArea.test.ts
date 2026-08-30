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
