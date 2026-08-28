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
