import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import PPanel from "./PPanel.vue";

test("renders what it is given", async () => {
  const screen = render(PPanel, { slots: { default: "Persona" } });

  await expect.element(screen.getByText("Persona")).toBeVisible();
});
