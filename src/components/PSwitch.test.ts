import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";
import { defineComponent, h, ref } from "vue";

import PSwitch from "./PSwitch.vue";

test("is a switch, named by its label", async () => {
  const screen = render(PSwitch, { props: { modelValue: false, label: "Pad past edges" } });

  await expect
    .element(screen.getByRole("switch", { name: "Pad past edges" }))
    .toBeVisible();
});

test("aria-checked follows modelValue", async () => {
  const screen = render(PSwitch, { props: { modelValue: true, label: "Pad past edges" } });
  const control = screen.getByRole("switch", { name: "Pad past edges" });

  await expect.element(control).toHaveAttribute("aria-checked", "true");

  await screen.rerender({ modelValue: false });

  await expect.element(control).toHaveAttribute("aria-checked", "false");
});

test("works with v-model, from the switch and from its label", async () => {
  const Host = defineComponent({
    setup() {
      const on = ref(false);
      return () =>
        h("div", [
          h(PSwitch, {
            label: "Needs frame",
            modelValue: on.value,
            "onUpdate:modelValue": (value: boolean) => (on.value = value),
          }),
          h("p", on.value ? "State: on" : "State: off"),
        ]);
    },
  });
  const screen = render(Host);

  await screen.getByRole("switch", { name: "Needs frame" }).click();
  await expect.element(screen.getByText("State: on")).toBeVisible();

  await screen.getByText("Needs frame").click();
  await expect.element(screen.getByText("State: off")).toBeVisible();
});

test("Space and Enter change the value", async () => {
  const onUpdate = vi.fn();
  const screen = render(PSwitch, {
    props: { modelValue: false, label: "Needs upscale", "onUpdate:modelValue": onUpdate },
  });

  await userEvent.tab();
  await expect.element(screen.getByRole("switch", { name: "Needs upscale" })).toHaveFocus();
  await userEvent.keyboard(" ");
  await userEvent.keyboard("{Enter}");

  expect(onUpdate.mock.calls).toEqual([[true], [true]]);
});

test("disabled blocks clicks and the keyboard", async () => {
  const onUpdate = vi.fn();
  const screen = render(PSwitch, {
    props: {
      modelValue: false,
      label: "Needs upscale",
      disabled: true,
      "onUpdate:modelValue": onUpdate,
    },
  });
  const control = screen.getByRole("switch", { name: "Needs upscale" });

  await expect.element(control).toBeDisabled();
  await control.click({ force: true });
  await screen.getByText("Needs upscale").click({ force: true });
  (control.element() as HTMLElement).focus();
  await userEvent.keyboard(" ");
  await userEvent.keyboard("{Enter}");

  expect(onUpdate).not.toHaveBeenCalled();
});
