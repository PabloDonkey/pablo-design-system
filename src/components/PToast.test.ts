import { afterEach, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-vue";

import PToastViewport from "./PToastViewport.vue";
import { useToast } from "./useToast";

/**
 * A toast is a short message that goes away by itself. These tests check the parts a screen
 * reader and a keyboard user depend on: the live-region role, the close button, and the timer
 * that must stop while the person is reading.
 *
 * The helper keeps one shared list, so every test clears it.
 */
afterEach(() => {
  useToast().clear();
});

function mount(props: Record<string, unknown> = {}) {
  const screen = render(PToastViewport, { props });
  // Scoped to the viewport. Reka also writes each message into a hidden live region on the
  // page body, so a bare getByText would find the text twice.
  const viewport = screen.getByRole("region", { name: /Notifications/ });
  return { screen, viewport };
}

test("show puts the text in the viewport", async () => {
  const { viewport } = mount();

  useToast().show({ text: "Saved the scenario" });

  await expect.element(viewport.getByText("Saved the scenario")).toBeVisible();
});

test("show returns an id that close accepts", async () => {
  const { viewport } = mount();
  const toast = useToast();

  const id = toast.show({ text: "Working", duration: 0 });
  await expect.element(viewport.getByText("Working")).toBeVisible();

  toast.close(id);

  await expect.element(viewport.getByText("Working")).not.toBeInTheDocument();
});

test("two calls to useToast share one list", async () => {
  const { viewport } = mount();

  useToast().show({ text: "From one place", duration: 0 });
  useToast().show({ text: "From another place", duration: 0 });

  await expect.element(viewport.getByText("From one place")).toBeVisible();
  await expect.element(viewport.getByText("From another place")).toBeVisible();
});

test("a danger toast has role=alert", async () => {
  const { viewport } = mount();

  useToast().show({ tone: "danger", text: "Could not save", duration: 0 });

  await expect.element(viewport.getByText("Could not save")).toBeVisible();
  const toast = document.querySelector('li[role="alert"]');
  expect(toast?.textContent).toContain("Could not save");
});

test("neutral and success toasts have role=status, not alert", async () => {
  const { viewport } = mount();

  useToast().show({ tone: "neutral", text: "Plain note", duration: 0 });
  useToast().show({ tone: "success", text: "All done", duration: 0 });

  await expect.element(viewport.getByText("All done")).toBeVisible();
  const statuses = [...document.querySelectorAll('li[role="status"]')].map((el) => el.textContent);
  expect(statuses.some((text) => text?.includes("Plain note"))).toBe(true);
  expect(statuses.some((text) => text?.includes("All done"))).toBe(true);
  expect(document.querySelector('li[role="alert"]')).toBeNull();
});

test("the tone is written on the toast", async () => {
  const { viewport } = mount();

  useToast().show({ tone: "success", text: "All done", duration: 0 });

  await expect.element(viewport.getByText("All done")).toBeVisible();
  expect(document.querySelector('li[data-tone="success"]')).not.toBeNull();
});

test("the tone defaults to neutral", async () => {
  const { viewport } = mount();

  useToast().show({ text: "Plain note", duration: 0 });

  await expect.element(viewport.getByText("Plain note")).toBeVisible();
  expect(document.querySelector('li[data-tone="neutral"]')).not.toBeNull();
});

test("the close button removes the toast", async () => {
  const { viewport } = mount();
  useToast().show({ text: "Close me", duration: 0 });

  await viewport.getByRole("button", { name: "Close" }).click();

  await expect.element(viewport.getByText("Close me")).not.toBeInTheDocument();
});

test("the toast closes by itself after its duration", async () => {
  const { viewport } = mount();
  useToast().show({ text: "Short lived", duration: 200 });

  await expect.element(viewport.getByText("Short lived")).toBeVisible();

  await expect.element(viewport.getByText("Short lived")).not.toBeInTheDocument();
});

test("a duration of 0 keeps the toast until it is closed", async () => {
  const { viewport } = mount();
  useToast().show({ text: "Stays", duration: 0 });

  await new Promise((resolve) => setTimeout(resolve, 400));

  await expect.element(viewport.getByText("Stays")).toBeVisible();
});

test("the timer pauses while the pointer is over the toast", async () => {
  const { viewport } = mount();
  useToast().show({ text: "Reading this", duration: 400 });
  const text = viewport.getByText("Reading this");
  await expect.element(text).toBeVisible();

  await userEvent.hover(text);
  await new Promise((resolve) => setTimeout(resolve, 900));

  await expect.element(text).toBeVisible();
});

test("the timer pauses while focus is inside the toast", async () => {
  const { viewport } = mount();
  useToast().show({ text: "Focused", duration: 400 });
  await expect.element(viewport.getByText("Focused")).toBeVisible();

  const close = document.querySelector<HTMLButtonElement>("li[data-tone] button");
  close?.focus();
  await new Promise((resolve) => setTimeout(resolve, 900));

  await expect.element(viewport.getByText("Focused")).toBeVisible();
});

test("the action button runs its callback and closes the toast", async () => {
  const { viewport } = mount();
  const onClick = vi.fn();
  useToast().show({
    tone: "danger",
    text: "Could not send",
    duration: 0,
    action: { label: "Retry", onClick },
  });

  await viewport.getByRole("button", { name: "Retry" }).click();

  expect(onClick).toHaveBeenCalledTimes(1);
  await expect.element(viewport.getByText("Could not send")).not.toBeInTheDocument();
});

test("a toast without an action has only the close button", async () => {
  const { viewport } = mount();
  useToast().show({ text: "No action", duration: 0 });

  await expect.element(viewport.getByText("No action")).toBeVisible();
  const buttons = document.querySelectorAll("li[data-tone] button");
  expect(buttons.length).toBe(1);
});

test("more than one toast shows at the same time", async () => {
  const { viewport } = mount();

  useToast().show({ text: "First", duration: 0 });
  useToast().show({ tone: "success", text: "Second", duration: 0 });
  useToast().show({ tone: "danger", text: "Third", duration: 0 });

  await expect.element(viewport.getByText("First")).toBeVisible();
  await expect.element(viewport.getByText("Second")).toBeVisible();
  await expect.element(viewport.getByText("Third")).toBeVisible();
});

test("clear removes every toast", async () => {
  const { viewport } = mount();
  useToast().show({ text: "One", duration: 0 });
  useToast().show({ text: "Two", duration: 0 });
  await expect.element(viewport.getByText("Two")).toBeVisible();

  useToast().clear();

  await expect.element(viewport.getByText("One")).not.toBeInTheDocument();
  await expect.element(viewport.getByText("Two")).not.toBeInTheDocument();
});

test("the offset prop lifts the viewport above a pinned bar", async () => {
  const { viewport } = mount({ offset: "5rem" });
  await expect.element(viewport).toBeInTheDocument();

  const element = document.querySelector<HTMLElement>('[role="region"]');
  expect(element?.style.getPropertyValue("--p-toast-offset")).toBe("5rem");
});

test("the viewport is a labelled region", async () => {
  const { viewport } = mount({ label: "Messages" });

  await expect.element(viewport).toBeInTheDocument();
  expect(document.querySelector('[role="region"]')?.getAttribute("aria-label")).toContain(
    "Messages",
  );
});
