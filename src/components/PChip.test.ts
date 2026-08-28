import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import PChip from "./PChip.vue";

/**
 * The element matters more than the styling here. A chip you can press has to be
 * a real button; a chip that only reports a fact must not be, or every status
 * marker on the page becomes a tab stop.
 */

test("a plain chip is not a button", async () => {
  const screen = render(PChip, { slots: { default: "turn 24" } });

  await expect.element(screen.getByText("turn 24")).toBeVisible();
  expect(screen.container.querySelector("button")).toBeNull();
});

test("an interactive chip is a real button, reachable by role", async () => {
  const screen = render(PChip, { props: { interactive: true }, slots: { default: "live" } });

  await screen.getByRole("button", { name: "live" }).click();

  expect(screen.emitted().click).toHaveLength(1);
});

test("an interactive chip carries type=button", async () => {
  const screen = render(PChip, { props: { interactive: true }, slots: { default: "live" } });

  await expect
    .element(screen.getByRole("button", { name: "live" }))
    .toHaveAttribute("type", "button");
});

test("a dismissible chip emits dismiss when the X is pressed", async () => {
  const screen = render(PChip, {
    props: { dismissible: true, dismissLabel: "Remove tag: noir" },
    slots: { default: "noir" },
  });

  await screen.getByRole("button", { name: "Remove tag: noir" }).click();

  expect(screen.emitted().dismiss).toHaveLength(1);
});

test("the chip text survives next to the X", async () => {
  const screen = render(PChip, { props: { dismissible: true }, slots: { default: "noir" } });

  await expect.element(screen.getByText("noir")).toBeVisible();
});

/**
 * A button cannot be nested inside a button. When a chip is both pressable and
 * removable it has to become a span holding two buttons, or the markup is
 * invalid and the X becomes unreachable.
 */
test("interactive and dismissible together give two separate buttons", async () => {
  const screen = render(PChip, {
    props: { interactive: true, dismissible: true, dismissLabel: "Remove tag: noir" },
    slots: { default: "noir" },
  });

  await expect.element(screen.getByRole("button", { name: "noir" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Remove tag: noir" })).toBeVisible();

  expect(screen.container.querySelector("button button")).toBeNull();
});
