import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import PPanel from "./PPanel.vue";

test("renders what it is given", async () => {
  const screen = render(PPanel, { slots: { default: "Persona" } });

  await expect.element(screen.getByText("Persona")).toBeVisible();
});

/**
 * These two assert computed style rather than class names on purpose. A class
 * assertion would pass on a panel whose token was deleted; this fails, which is
 * the whole point of having a token layer.
 */
test("has a visible border by default, and none when borderless", async () => {
  const bordered = render(PPanel, { slots: { default: "bordered" } });
  const borderedWidth = getComputedStyle(
    bordered.container.firstElementChild as Element,
  ).borderTopWidth;
  expect(borderedWidth).not.toBe("0px");

  const plain = render(PPanel, { props: { borderless: true }, slots: { default: "plain" } });
  const plainWidth = getComputedStyle(
    plain.container.firstElementChild as Element,
  ).borderTopWidth;
  expect(plainWidth).toBe("0px");
});

test("has no shadow by default, and a real one when asked", async () => {
  const flat = render(PPanel, { slots: { default: "flat" } });
  expect(getComputedStyle(flat.container.firstElementChild as Element).boxShadow).toBe("none");

  for (const shadow of ["raised", "floating"] as const) {
    const lifted = render(PPanel, { props: { shadow }, slots: { default: shadow } });
    const box = getComputedStyle(lifted.container.firstElementChild as Element).boxShadow;
    expect(box).not.toBe("none");
    // A token that failed to resolve leaves the property empty rather than
    // "none", so check it actually produced a colour and an offset.
    expect(box).toMatch(/rgba?\(/);
  }
});
