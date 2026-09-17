import { expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";

import PSelect from "./PSelect.vue";

const options = [
  { value: "auto", label: "Automatic" },
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
];

test("shows the label of the selected option, not its value", async () => {
  const screen = render(PSelect, { props: { modelValue: "en", options } });

  await expect.element(screen.getByRole("combobox")).toHaveTextContent("English");
});

test("shows the placeholder when nothing is selected", async () => {
  const screen = render(PSelect, {
    props: { modelValue: "", options, placeholder: "Choose one…" },
  });

  await expect.element(screen.getByRole("combobox")).toHaveTextContent("Choose one…");
});

test("opening the trigger lists every option by role, reachable by label", async () => {
  const screen = render(PSelect, { props: { modelValue: "auto", options } });

  await screen.getByRole("combobox").click();

  await expect.element(screen.getByRole("listbox")).toBeVisible();
  await expect.element(screen.getByRole("option", { name: "English" })).toBeVisible();
  await expect.element(screen.getByRole("option", { name: "French" })).toBeVisible();
});

test("picking an option emits its value, not its label", async () => {
  const screen = render(PSelect, { props: { modelValue: "auto", options } });

  await screen.getByRole("combobox").click();
  await screen.getByRole("option", { name: "French" }).click();

  expect(screen.emitted()["update:modelValue"]).toEqual([["fr"]]);
});

test("a disabled select cannot be opened", async () => {
  const screen = render(PSelect, { props: { modelValue: "auto", options, disabled: true } });

  await expect.element(screen.getByRole("combobox")).toBeDisabled();
});

test("Escape closes the listbox and returns focus to the trigger", async () => {
  const screen = render(PSelect, { props: { modelValue: "auto", options } });
  const trigger = screen.getByRole("combobox");

  await trigger.click();
  await expect.element(screen.getByRole("listbox")).toBeVisible();

  await userEvent.keyboard("{Escape}");

  await expect.element(screen.getByRole("listbox")).not.toBeInTheDocument();
  await expect.element(trigger).toHaveFocus();
});

test("v-model stays in sync when the parent re-renders with the emitted value", async () => {
  // Mirrors how a real caller wires it up (`v-model="draft.language"`) rather than only
  // asserting the emit fired, since PSelect reads its label from `modelValue`, not from
  // internal state -- a caller that ignores the emit would show the trigger stuck on the
  // old label even though the click "worked".
  const onUpdate = vi.fn();
  const screen = render(PSelect, {
    props: {
      modelValue: "auto",
      options,
      "onUpdate:modelValue": (value: string) => {
        onUpdate(value);
        screen.rerender({ modelValue: value, options });
      },
    },
  });

  await screen.getByRole("combobox").click();
  await screen.getByRole("option", { name: "English" }).click();

  expect(onUpdate).toHaveBeenCalledWith("en");
  await expect.element(screen.getByRole("combobox")).toHaveTextContent("English");
});
