// Loads Tailwind's utilities plus this package's tokens, fonts and base layer,
// so stories are styled the way a consuming application would style them.
import "./preview.css";

/**
 * Make Histoire's light/dark toggle drive this package's tokens.
 *
 * Histoire themes its sandbox by putting a CLASS on the root element
 * (`sandboxDarkClass`, "dark" by default). This package themes by `data-theme`
 * and has no class hook on purpose -- a shared package should not force one
 * dark-mode strategy onto every application that installs it.
 *
 * So mirror one onto the other. Both states are set explicitly, which is the
 * part that matters: Histoire only ever ADDS a class for dark and removes it
 * for light, so on a machine whose operating system is set to dark, "light"
 * would fall through to `prefers-color-scheme` and stay dark.
 */
function syncThemeFromHistoire(): void {
  const root = document.documentElement;
  // Histoire marks the sandbox with `sandboxDarkClass` ("dark"), and mirrors
  // its own shell theme as `htw-dark`. Follow either, so the toggle in the
  // header actually changes the components and not just the chrome.
  const dark = root.classList.contains("dark") || root.classList.contains("htw-dark");
  root.dataset.theme = dark ? "dark" : "light";
}

if (typeof document !== "undefined") {
  syncThemeFromHistoire();
  // Only `class` is watched, and only `data-theme` is written, so this cannot
  // trigger itself.
  new MutationObserver(syncThemeFromHistoire).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
