import { afterEach, beforeEach, expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import PThemeToggle from "./PThemeToggle.vue";

const STORAGE_KEY = "pablo-theme";

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  delete document.documentElement.dataset.theme;
});

afterEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  delete document.documentElement.dataset.theme;
});

test("a stored choice is applied to the root element on mount", async () => {
  localStorage.setItem(STORAGE_KEY, "dark");

  render(PThemeToggle);

  await expect
    .poll(() => document.documentElement.dataset.theme)
    .toBe("dark");
});

test("with nothing stored, the root element is left alone (the OS preference stays in charge)", async () => {
  render(PThemeToggle);

  // Give onMounted a tick, then confirm no attribute was written either way.
  await expect.poll(() => document.documentElement.dataset.theme).toBe(undefined);
});

test("clicking toggles the theme, writes the DOM attribute, and persists the choice", async () => {
  localStorage.setItem(STORAGE_KEY, "light");
  const screen = render(PThemeToggle);

  await screen.getByRole("button", { name: "Switch to dark theme" }).click();

  await expect.poll(() => document.documentElement.dataset.theme).toBe("dark");
  await expect.poll(() => localStorage.getItem(STORAGE_KEY)).toBe("dark");
  await expect.element(screen.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
});
