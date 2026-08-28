import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import PSectionLabel from "./PSectionLabel.vue";

test("is a heading by default, so the page has a real outline", async () => {
  const screen = render(PSectionLabel, { slots: { default: "Directives" } });

  await expect.element(screen.getByRole("heading", { name: "Directives" })).toBeVisible();
});

test("the heading level can be chosen, because only the page knows it", async () => {
  const screen = render(PSectionLabel, { props: { as: "h3" }, slots: { default: "Memory" } });

  await expect
    .element(screen.getByRole("heading", { name: "Memory", level: 3 }))
    .toBeVisible();
});

test("can opt out of being a heading entirely", async () => {
  const screen = render(PSectionLabel, { props: { as: "span" }, slots: { default: "Turn" } });

  await expect.element(screen.getByText("Turn")).toBeVisible();
  expect(screen.container.querySelector("h2, h3, h4")).toBeNull();
});
