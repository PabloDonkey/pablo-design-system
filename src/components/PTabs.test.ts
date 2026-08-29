import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-vue";

import PTabs from "./PTabs.vue";

const tabs = [
  { id: "persona", label: "Persona", summary: "Mira Vance" },
  { id: "memory", label: "Memory", summary: "38% of the window" },
  { id: "directives", label: "Directives" },
];

test("renders every tab, reachable by role and name", async () => {
  const screen = render(PTabs, { props: { tabs, modelValue: null } });

  await expect.element(screen.getByRole("button", { name: /Persona/ })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: /Memory/ })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: /Directives/ })).toBeVisible();
});

test("the open tab is marked aria-expanded, the rest are not", async () => {
  const screen = render(PTabs, { props: { tabs, modelValue: "memory" } });

  await expect
    .element(screen.getByRole("button", { name: /Memory/ }))
    .toHaveAttribute("aria-expanded", "true");
  await expect
    .element(screen.getByRole("button", { name: /Persona/ }))
    .toHaveAttribute("aria-expanded", "false");
});

test("clicking a tab emits its id, even the already-open one", async () => {
  const onUpdate = vi.fn();
  const screen = render(PTabs, {
    props: { tabs, modelValue: "memory", "onUpdate:modelValue": onUpdate },
  });

  await screen.getByRole("button", { name: /Memory/ }).click();
  await screen.getByRole("button", { name: /Persona/ }).click();

  expect(onUpdate.mock.calls).toEqual([["memory"], ["persona"]]);
});

test("a summary shows beside its tab's label, and a tab without one shows none", async () => {
  const screen = render(PTabs, { props: { tabs, modelValue: null } });

  await expect.element(screen.getByText("38% of the window")).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: /Directives/ }))
    .not.toHaveTextContent("undefined");
});
