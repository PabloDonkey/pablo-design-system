import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
// From `vitest/config`, not `vite`: it is the same `defineConfig` widened to
// accept the `test` block below. Importing it from `vite` type-errors on it.
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Named so the first test run on a clean checkout does not discover these
  // mid-run and reload. Vitest warns that this is a source of flaky runs, and
  // it is not theoretical here: on a cold cache every slot-rendering test in
  // this package failed with "Cannot read properties of null (reading 'ce')",
  // because the reload tore down the component instance mid-render.
  optimizeDeps: {
    include: ["vue", "vitest-browser-vue", "@vue/test-utils"],
  },
  // Components are tested in a real browser, not a simulated DOM -- the same
  // choice rp-engine made, for the same reason: real focus and real layout.
  // Screenshot baselines especially cannot be taken in a fake DOM.
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      // Baselines land in __screenshots__ beside the test file, which is the
      // default and is what gets committed. `screenshotDirectory` is NOT set:
      // for toMatchScreenshot it resolves against the test file rather than the
      // project root, so setting it produced a doubled path.
      //
      // Failure output must never land beside the baselines, or a failed run
      // would look like a new baseline next time someone stages files.
      screenshotFailures: false,
    },
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test-setup.ts"],
  },
});
