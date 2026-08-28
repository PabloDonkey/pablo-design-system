import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import PButton from "./PButton.vue";

test("is reachable by role and accessible name", async () => {
  const screen = render(PButton, { slots: { default: "Retire scenario" } });

  await expect.element(screen.getByRole("button", { name: "Retire scenario" })).toBeVisible();
});

test("a disabled button does not emit a click", async () => {
  const screen = render(PButton, { props: { disabled: true }, slots: { default: "Send" } });

  const button = screen.getByRole("button", { name: "Send" });
  await expect.element(button).toBeDisabled();

  // `force` bypasses the actionability check so the click really is dispatched.
  // Without it this test would pass on a button that merely looks disabled.
  await button.click({ force: true });

  expect(screen.emitted().click).toBeUndefined();
});

test("an enabled button does emit a click", async () => {
  const screen = render(PButton, { slots: { default: "Send" } });

  await screen.getByRole("button", { name: "Send" }).click();

  expect(screen.emitted().click).toHaveLength(1);
});

test("defaults to type=button, so it cannot submit a form by accident", async () => {
  const screen = render(PButton, { slots: { default: "Add rule" } });

  await expect
    .element(screen.getByRole("button", { name: "Add rule" }))
    .toHaveAttribute("type", "button");
});

test("the danger variant is still just a button to a screen reader", async () => {
  const screen = render(PButton, { props: { variant: "danger" }, slots: { default: "Delete" } });

  await expect.element(screen.getByRole("button", { name: "Delete" })).toBeVisible();
});
