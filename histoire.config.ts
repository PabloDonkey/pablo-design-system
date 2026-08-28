import { HstVue } from "@histoire/plugin-vue";
import { defineConfig } from "histoire";

export default defineConfig({
  plugins: [HstVue()],
  // Where the design tokens and fonts get loaded, so stories are styled.
  setupFile: "/src/histoire.setup.ts",
  storyMatch: ["src/**/*.story.vue"],
});
