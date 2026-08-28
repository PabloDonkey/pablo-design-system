import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import PPanel from "./PPanel.vue";

const root = (screen: { container: Element }) => screen.container.firstElementChild as Element;

test("renders what it is given", async () => {
  const screen = render(PPanel, { slots: { default: "Persona" } });

  await expect.element(screen.getByText("Persona")).toBeVisible();
});

test("brings no padding of its own, so a class has full control", async () => {
  const bare = render(PPanel, { slots: { default: "bare" } });
  expect(getComputedStyle(root(bare)).paddingTop).toBe("0px");

  const padded = render(PPanel, { attrs: { class: "p-4" }, slots: { default: "padded" } });
  expect(getComputedStyle(root(padded)).paddingTop).not.toBe("0px");
});

/**
 * These assert computed style rather than class names on purpose. A class
 * assertion would pass on a panel whose token was deleted; this fails, which is
 * the point of having a token layer at all.
 */
test("has a visible border by default, and none when borderless", async () => {
  const bordered = render(PPanel, { slots: { default: "bordered" } });
  expect(getComputedStyle(root(bordered)).borderTopWidth).not.toBe("0px");

  const plain = render(PPanel, { props: { borderless: true }, slots: { default: "plain" } });
  expect(getComputedStyle(root(plain)).borderTopWidth).toBe("0px");
});

test("has no shadow by default, and a real one when asked", async () => {
  const flat = render(PPanel, { slots: { default: "flat" } });
  expect(getComputedStyle(root(flat)).boxShadow).toBe("none");

  const seen = new Set<string>();
  for (const shadow of ["raised", "floating"] as const) {
    const lifted = render(PPanel, { props: { shadow }, slots: { default: shadow } });
    const box = getComputedStyle(root(lifted)).boxShadow;
    expect(box).not.toBe("none");
    expect(box).toMatch(/rgba?\(/);
    seen.add(box);
  }
  // The two elevations must actually differ, or one token silently fell back.
  expect(seen.size).toBe(2);
});

test("paints its own text colour rather than inheriting the host's", async () => {
  const screen = render(PPanel, { slots: { default: "readable" } });

  expect(getComputedStyle(root(screen)).color).toBe("rgb(20, 28, 27)");
});
