import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-vue";
import { defineComponent, h } from "vue";
import type { Component } from "vue";

import PToastViewport from "./PToastViewport.vue";
import { useToast } from "./useToast";

/**
 * Visual baselines for the toast, in light and dark.
 *
 * The viewport is fixed to the bottom of the screen. The board has a `transform`, which makes
 * it the containing block for fixed children, so the stack lands inside the board and the
 * screenshot can see it.
 */
afterEach(() => {
  useToast().clear();
});

function board(theme: "light" | "dark"): Component {
  return defineComponent({
    setup: () => () =>
      h(
        "div",
        {
          "data-theme": theme,
          "data-testid": "board",
          class: "relative h-72 w-96 bg-ground",
          style: "transform: translateZ(0)",
        },
        [h(PToastViewport)],
      ),
  });
}

for (const theme of ["light", "dark"] as const) {
  test(`PToast renders every tone on the ${theme} ground`, async () => {
    const screen = render(board(theme));
    const toast = useToast();
    toast.show({ tone: "neutral", text: "Saved to your drafts", duration: 0 });
    toast.show({ tone: "success", text: "Scenario exported", duration: 0 });
    toast.show({ tone: "danger", text: "Could not reach the server", duration: 0 });

    await expect.element(screen.getByText("Could not reach the server").first()).toBeVisible();
    await expect.element(screen.getByTestId("board")).toMatchScreenshot(`toast-tones-${theme}`);
  });

  test(`PToast renders a stack of three on the ${theme} ground`, async () => {
    const screen = render(board(theme));
    const toast = useToast();
    toast.show({ text: "Turn 24 saved", duration: 0 });
    toast.show({ text: "Turn 25 saved", duration: 0 });
    toast.show({ text: "Turn 26 saved", duration: 0 });

    await expect.element(screen.getByText("Turn 26 saved").first()).toBeVisible();
    await expect.element(screen.getByTestId("board")).toMatchScreenshot(`toast-stack-${theme}`);
  });

  test(`PToast renders an action on the ${theme} ground`, async () => {
    const screen = render(board(theme));
    useToast().show({
      tone: "danger",
      text: "Could not send the message",
      duration: 0,
      action: { label: "Retry", onClick: () => {} },
    });

    await expect.element(screen.getByText("Could not send the message").first()).toBeVisible();
    await expect.element(screen.getByTestId("board")).toMatchScreenshot(`toast-action-${theme}`);
  });
}
