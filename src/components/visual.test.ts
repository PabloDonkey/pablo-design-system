import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import { defineComponent, h } from "vue";
import type { Component, VNodeChild } from "vue";

import PButton from "./PButton.vue";
import PChip from "./PChip.vue";
import PPanel from "./PPanel.vue";
import PSectionLabel from "./PSectionLabel.vue";

/**
 * Visual baselines.
 *
 * These are what a token change is checked against. A behaviour test cannot see
 * that an accent went muddy or a border vanished; this can. Baselines are
 * committed, so a deliberate colour change is expected to fail these once and
 * be re-recorded on purpose -- that is the point, not a fault.
 *
 * Each case is rendered twice, on both grounds, because a token that exists in
 * only one theme is the specific bug this package is meant to make impossible.
 */
function board(theme: "light" | "dark", body: () => VNodeChild): Component {
  return defineComponent({
    setup: () => () =>
      h(
        "div",
        {
          // `data-theme` is the whole of theme switching here. No class to add,
          // no second token set to keep in step.
          "data-theme": theme,
          "data-testid": "board",
          class: "flex flex-wrap items-center gap-2 bg-ground p-4",
        },
        [body()],
      ),
  });
}

const themes = ["light", "dark"] as const;

for (const theme of themes) {
  test(`PButton renders every variant on the ${theme} ground`, async () => {
    const screen = render(
      board(theme, () =>
        h("div", { class: "flex flex-wrap items-center gap-2" }, [
          h(PButton, { variant: "primary" }, () => "Primary"),
          h(PButton, { variant: "secondary" }, () => "Secondary"),
          h(PButton, { variant: "danger" }, () => "Danger"),
          h(PButton, { variant: "ghost" }, () => "Ghost"),
          h(PButton, { variant: "primary", disabled: true }, () => "Disabled"),
        ]),
      ),
    );

    await expect.element(screen.getByTestId("board")).toMatchScreenshot(`button-${theme}`);
  });

  test(`PChip renders every tone on the ${theme} ground`, async () => {
    const screen = render(
      board(theme, () =>
        h("div", { class: "flex flex-wrap items-center gap-2" }, [
          h(PChip, null, () => "neutral"),
          h(PChip, { tone: "accent" }, () => "accent"),
          h(PChip, { tone: "warning" }, () => "warning"),
          h(PChip, { tone: "danger" }, () => "danger"),
          h(PChip, { interactive: true }, () => "interactive"),
        ]),
      ),
    );

    await expect.element(screen.getByTestId("board")).toMatchScreenshot(`chip-${theme}`);
  });

  test(`PPanel and PSectionLabel render on the ${theme} ground`, async () => {
    const screen = render(
      board(theme, () =>
        h("div", { class: "w-80" }, [
          h(PSectionLabel, { class: "mb-2" }, () => "Persona"),
          h(PPanel, null, () => "Mira Vance, a lighthouse keeper's apprentice."),
        ]),
      ),
    );

    await expect.element(screen.getByTestId("board")).toMatchScreenshot(`panel-${theme}`);
  });
}
