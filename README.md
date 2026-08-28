# pablo-design-system

Shared design tokens and Vue 3 primitives. Built for Tailwind 4.

The first consumer is the rp-engine admin panel. The package is written to be
installed by any of Pablo's Vue projects, so nothing in it knows about any one
application's domain.

## What is in it

- **Tokens** — colour, type, radius. Every colour is defined for light and dark.
- **A base layer** — page background, body text, and a visible keyboard focus ring.
- **Four primitives** — `PButton`, `PChip`, `PPanel`, `PSectionLabel`.

## Install it

The package is not published. Consume it from a local path while it is moving:

```jsonc
// package.json
"dependencies": {
  "pablo-design-system": "file:../pablo-design-system"
}
```

Then pin a tag once it settles:

```jsonc
"pablo-design-system": "github:PabloDonkey/pablo-design-system#v0.1.0"
```

## Wire it up

Three lines in the application's stylesheet:

```css
@import "tailwindcss";
@import "pablo-design-system/styles.css";
@source "../node_modules/pablo-design-system/dist";
```

**The `@source` line is required.** Tailwind skips `node_modules` when it looks
for class names. Without that line the package generates no CSS at all, and
nothing reports an error. The page just renders unstyled.

The application also needs Vue resolved once:

```ts
// vite.config.ts
resolve: { dedupe: ["vue"] }
```

Without it a local path install loads a second copy of Vue, and Vue throws.

### Check that it worked

```bash
npm run build
grep -c "border-hairline" dist/assets/*.css   # must be greater than 0
```

## Change the colours

The package ships its own palette. An application overrides any token by
redefining it. Put the override after the import:

```css
:root { --color-accent: #2563eb; }
[data-theme="dark"] { --color-accent: #93c5fd; }
```

This works because `@theme` output sits inside Tailwind's `theme` layer, and an
unlayered rule beats a layered one.

To **add** a token rather than change one, use the application's own `@theme`
block. Only `@theme` creates utility classes.

## Dark mode

A page follows the operating system with no work. Tokens carry the theme, so no
component writes a `dark:` class.

To force a theme, set `data-theme` on any element:

```ts
document.documentElement.dataset.theme = "dark";  // whole page
```

It works on a subtree too, because the tokens are inherited custom properties.
A dark panel inside a light page is `<div data-theme="dark">`.

## Develop

```bash
npm run story:dev    # Histoire — look at every primitive, light and dark
npm run test         # behaviour tests and visual baselines, in real Chromium
npm run typecheck
npm run build
```

### About the visual baselines

`src/components/__screenshots__` is **committed on purpose**. It is how a token
change that quietly breaks a component gets caught.

When a component changes on purpose, these tests fail once. Delete the affected
baseline, run the tests to record a new one, then **look at the image** before
staging it. A baseline nobody looked at proves nothing.

They will also fail after a Playwright browser upgrade, and on a different
machine, because font rendering differs. That is expected, not a regression.

## Rules for anyone adding a component

**Never build a class name from a variable.** The consuming application's
Tailwind scans this package's compiled output for class names, so a class
assembled at runtime is never found and silently generates no CSS.

```ts
const tones = { danger: "text-danger" };   // yes — a full literal
const cls = `text-${tone}`;                // no  — invisible to the scanner
```
