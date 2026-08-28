# S001 · v0.1 — tokens and four primitives

> **FROZEN.** This epic is finished. Do not edit it — reopening the work means a new epic.

**Status:** ✅ COMPLETE — 2026-08-28.
**Consumer:** rp-engine, which adopts this in its own `S033`.
**Design source:** "The Play View" mockup. Its palette and typeface pairing were ported,
not redesigned. Its ~20 ad-hoc font sizes were **not** ported — they became seven named steps.

## Goal

One visual system, defined once, installable by any Vue project. Reached by measuring
rp-engine: 32 buttons with 8 hand-written class strings, `text-neutral-500` 116 times,
`border-black/10` paired with `dark:border-white/10` 71 times each, and no focus styling
anywhere in the application.

## What shipped

- [x] **Tokens** in `@theme static`. `static` matters: without it Tailwind prunes theme
      variables no utility uses, and a consumer could not override them.
- [x] **Every colour defined three times** — light, operating-system dark, explicit
      `data-theme`. The theme lives in the token, so **no component writes a `dark:` class**.
- [x] Explicit theming works on **any element**, not only `:root`, so a subtree can be
      re-themed. A whole-page toggle is the same mechanism applied to `<html>`.
- [x] Seven named type steps, two radii, three typefaces self-hosted through `@fontsource`.
- [x] A **focus ring** in the base layer. rp-engine had none at all.
- [x] `PButton`, `PChip`, `PPanel`, `PSectionLabel`.
- [x] 18 browser tests, queried by role and text. Zero class or test-id queries.
- [x] Six committed visual baselines, light and dark.
- [x] Histoire: 4 stories, 13 variants.

## Decisions worth keeping

**Tokens carry the theme, not `dark:` classes.** A shared package cannot own the consumer's
dark-mode strategy — an app that later switches to a class strategy would silently get a
package whose dark styles never fire. Values in the token work under any strategy.

**Per-theme redefinition, not `light-dark()`.** Both put the theme in the token. The
discriminator is that Tailwind compiles `bg-surface/50` to `color-mix(in oklab, …)`, and
whether `color-mix()` accepts a `light-dark()` argument was not verifiable without running a
browser. rp-engine has ~30 opacity-modified colours. Writing each colour three times in one
file costs less than an unverified mechanic at 30 call sites.

**The package ships class strings, not compiled utilities.** A compiled stylesheet would
duplicate the utility layer and freeze the package's classes against its own theme. The
consumer's Tailwind scans `dist` and emits one layer from one theme. The price is one
`@source` line — which fails **silently** if forgotten, so the README leads with it.

**Reka UI is not installed.** None of these four primitives need it; a `<button>` is enough.
It arrives in S002 with `PMenu`, the one component that justifies it.

## What the work found

1. **A cold dependency cache broke every slot-rendering test.** All 12 failed with
   `Cannot read properties of null (reading 'ce')`. A warm re-run passed, which is what
   identified it. `optimizeDeps.include` fixes it. Without this a fresh clone fails its
   first test run — the same flake rp-engine's own config comment warns about.
2. **`screenshotDirectory` does not do what its doc comment says.** For
   `toMatchScreenshot` it resolves against the test file, not the project root, and produced
   a doubled path. The default already puts baselines beside the test, so the option is now
   unset. `screenshotFailures: false` stays, so failure output never lands beside committed
   baselines.
3. **The first baselines were unstyled browser-default buttons.** The shipped stylesheet
   deliberately does not import Tailwind, so the preview context has to play the consumer's
   part and import both. Fixed with `src/preview.css`. The screenshot showed this instantly;
   a behaviour test never would have.
4. **`data-theme` on a nested element did nothing**, so the light and dark baselines were
   byte-identical. `:root[data-theme]` cannot match a subtree. Now a plain attribute selector.

## Verified

- [x] `npm run typecheck` clean.
- [x] `npm run test` — 18 passed, including from a **cold** cache.
- [x] `npm run build` — `dist/index.js` 3.81 kB, declarations for all four components,
      every Tailwind class string present as a literal.
- [x] `npm run story:build` — 4 stories, 13 variants.
- [x] **`@source` follows an npm `file:` symlink.** Proved in a throwaway consumer whose own
      markup used none of the package's classes: all seven package-only utilities appeared in
      the output, with the token variables, 19 `@font-face` rules and the focus rule.
- [x] Every baseline looked at by eye, both themes.

## Not done, on purpose

- No component uses Reka UI yet (S002).
- No form controls moved in. rp-engine's `MetadataField` and `StringListField` carry bug
  fixes with the tests that found them; splitting a fix from its test is how a fix gets
  tidied away later.
- Not published to any registry.
- Nothing in rp-engine changed. That is its `S033`.
