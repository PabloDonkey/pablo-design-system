import { HstVue } from "@histoire/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "histoire";

export default defineConfig({
  plugins: [HstVue()],
  // Where the design tokens, fonts and Tailwind's utilities get loaded.
  setupFile: "/src/histoire.setup.ts",
  storyMatch: ["src/**/*.story.vue"],
  vite: {
    // Histoire reuses the project's vite.config.ts, and that one is the LIBRARY
    // build -- it has `vue()` and nothing else on purpose. Without adding the
    // Tailwind plugin here, `@import "tailwindcss"` is never expanded: the
    // tokens and fonts load, no utility class does, and every component renders
    // as unstyled text.
    plugins: [tailwindcss()],
  },
});
