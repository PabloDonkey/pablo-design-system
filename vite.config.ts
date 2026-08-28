import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// Library mode. This config builds the package; it deliberately does NOT run
// the tests -- an `entry`/`external` build is the wrong shape for a test run,
// so the Vitest config lives in its own file.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "index.js",
    },
    // `vue` is the consumer's copy. The font packages are plain CSS side
    // effects that the consumer resolves, so they stay external too.
    // `reka-ui` is also external so the consumer resolves one copy.
    rollupOptions: { external: [/^vue$/, /^@fontsource/, /^reka-ui$/] },
    cssCodeSplit: false,
    // The consumer minifies. Leaving this off keeps the Tailwind class strings
    // readable in dist/, which matters: the consumer's Tailwind scans this
    // output for class names, and a grep is how we check it worked.
    minify: false,
  },
});
