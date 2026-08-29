import { h } from "vue";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";

import PButton from "./PButton.vue";
import PMenu from "./PMenu.vue";

const items = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Delete", value: "delete", disabledReason: "Cannot delete the default scenario" },
];

/**
 * The trigger slot exists so a caller can pass its own button — `PButton`, or a bespoke one
 * like rp-engine's `[ Send ▾ ]` toggle. Reka's `DropdownMenuTrigger` must merge onto that
 * element rather than wrap it in a second one: a `<button>` cannot nest inside a `<button>`,
 * the browser splits an attempt into two sibling buttons, and a role query then resolves to
 * both. This is `as-child` doing its job — remove it and this test fails.
 */
test("the slotted trigger is the only button, not wrapped in a second one", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: { default: "<button>Open Menu</button>" },
  });

  expect(screen.container.querySelectorAll("button").length).toBe(1);
  await expect.element(screen.getByRole("button", { name: "Open Menu" })).toBeVisible();
});

test("a real trigger component (PButton) still ends up as one button, with the menu's attrs merged onto it", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: { default: () => h(PButton, null, () => "Actions") },
  });

  const trigger = screen.getByRole("button", { name: "Actions" });
  await expect.element(trigger).toBeVisible();
  await expect.element(trigger).toHaveAttribute("aria-haspopup", "menu");
  expect(screen.container.querySelectorAll("button").length).toBe(1);
});

test("clicking the trigger opens the menu, and every item is reachable by role", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: { default: "<button>Menu</button>" },
  });

  await screen.getByRole("button", { name: "Menu" }).click();

  await expect.element(screen.getByRole("menu")).toBeVisible();
  await expect.element(screen.getByRole("menuitem", { name: "Edit" })).toBeVisible();
  await expect.element(screen.getByRole("menuitem", { name: "Duplicate" })).toBeVisible();
});

test("selecting an item emits its value and closes the menu", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: { default: "<button>Menu</button>" },
  });

  await screen.getByRole("button", { name: "Menu" }).click();
  await screen.getByRole("menuitem", { name: "Duplicate" }).click();

  expect(screen.emitted().select).toEqual([["duplicate"]]);
  await expect.element(screen.getByRole("menu")).not.toBeInTheDocument();
});

test("an item with disabledReason is disabled and shows the reason beside its label", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: { default: "<button>Menu</button>" },
  });

  await screen.getByRole("button", { name: "Menu" }).click();

  const deleteItem = screen.getByRole("menuitem", { name: /Delete/ });
  await expect.element(deleteItem).toHaveAttribute("data-disabled");
  await expect
    .element(screen.getByText("Cannot delete the default scenario"))
    .toBeVisible();
});

/**
 * `disabled` and `disabledReason` are separate: a caller can grey an item out without
 * committing to explain why (e.g. "a turn is generating" — TurnComposer's case).
 */
test("an item with disabled:true is disabled with no reason shown", async () => {
  const screen = render(PMenu, {
    props: { items: [{ label: "Continue", value: "continue", disabled: true }] },
    slots: { default: "<button>Menu</button>" },
  });

  await screen.getByRole("button", { name: "Menu" }).click();

  await expect
    .element(screen.getByRole("menuitem", { name: "Continue" }))
    .toHaveAttribute("data-disabled");
});

test("Escape closes the menu and returns focus to the trigger", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: { default: "<button>Menu</button>" },
  });
  const trigger = screen.getByRole("button", { name: "Menu" });

  await trigger.click();
  await expect.element(screen.getByRole("menu")).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(screen.getByRole("menu")).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
});
