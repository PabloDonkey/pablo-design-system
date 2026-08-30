# Pablo Design System — Dev Board

## 🔵 Backlog

### **S003** · Move the generic form controls in — `TextField` and `OptionCards` in rp-engine are generic enough to share. They stay put until a **second** consumer says what a shared text field actually needs. Guessing now produces props nobody wants. `MetadataField` and `StringListField` are **not** candidates: they carry rp-engine's domain shapes and their own bug fixes. → [epic](epics/S003-move-generic-form-controls.md)

### **S004** · A dialog — the obvious next primitive, and the one that would make Reka UI pay for itself. Blocked on a real consumer: rp-engine confirms with `window.confirm()` in 8 places, and replacing those is a **behaviour change** that belongs in an rp-engine epic, not here. → [epic](epics/S004-dialog.md)

## 🟡 Up Next

### **S002** · v0.2 — `PMenu`, wrapping Reka UI's `DropdownMenu`. This is the one component that justifies the dependency: rp-engine's `TurnComposer.vue` hand-rolls roving focus, arrow keys, Escape, outside-pointerdown close and focus-return-to-trigger, backed by 153 lines of test. Reka does all of it plus typeahead and portalling. **Acceptance is strict: `TurnComposer.test.ts` must pass unchanged** — if a test needs editing, the swap changed behaviour and should be reverted. `reka-ui` gets installed here and not before. → [epic](epics/S002-pmenu-reka-dropdown.md)

## 🟢 In Progress

## ✅ Done (recent)

### **S005 · 2026-08-29 · `PScrollArea`, wrapping Reka UI's `ScrollArea`** — a subtle, cross-browser scrollbar (track and thumb only, no native end buttons) for rp-engine's session transcript and message composer. `visible` prop, boolean: `true` (default) uses Reka's own hover-reveal, `false` never renders one at all while the area still scrolls. Two other shapes were floated mid-build and rejected — a `type` prop leaking Reka's five-way enum, and a numeric `opacity` prop for a mouse-proximity fade nothing needed. 46/46 tests, typecheck, build clean. → [epic](archive/S005-2026-08-29-scroll-area.md)

### **S001 · 2026-08-28 · v0.1 — tokens and four primitives** — the package exists and is verified end to end. Tokens for colour, type and radius, each colour defined for light **and** dark, ported from the "The Play View" mockup rather than invented. Four primitives — `PButton`, `PChip`, `PPanel`, `PSectionLabel` — 18 tests green in real Chromium, `vue-tsc` clean, `dist/index.js` at 3.81 kB with every Tailwind class string intact. **The two risks the plan named were both settled by measurement, not argument:** Tailwind's `@source` *does* follow an npm `file:` symlink (proved in a throwaway consumer that used none of the package's classes in its own markup, then found all seven of them in the output), and the theme lives in the token so no component writes a `dark:` class. **Three real bugs the work found, all fixed:** a cold dependency cache made every slot-rendering test fail with `Cannot read properties of null (reading 'ce')` — `optimizeDeps.include` fixes it, and a fresh clone would have hit it on first run; `screenshotDirectory` resolves against the *test file* for `toMatchScreenshot`, not the project root as its own doc comment says, so setting it wrote baselines to a doubled path; and the first baselines came out as unstyled browser-default buttons, because the shipped stylesheet deliberately does not import Tailwind and the preview context has to play the consumer's part. Committed visual baselines caught that last one in the first screenshot. Histoire builds 4 stories, 13 variants. → [epic](archive/S001-2026-08-28-v0-1-tokens-and-primitives.md)
