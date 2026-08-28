<template>
  <Story title="Introduction" icon="carbon:document" docs-only />
</template>

<docs lang="md">
# pablo-design-system

Shared design tokens and Vue 3 primitives, built for Tailwind 4.

The first consumer is the rp-engine admin panel. Nothing in this package knows about any one
application's domain, so any Vue project can install it.

## The idea in one paragraph

Most of what looks like a component problem is a token problem. The rp-engine panel had 32
buttons written eight different ways, but it also had `text-neutral-500` written 116 times
and `border-black/10` paired with `dark:border-white/10` 71 times each. Those need a name,
not a component. So this package is mostly **tokens**, plus the four components the
repetition actually justified.

## The components

| Component | What it is for |
|---|---|
| **PButton** | Every clickable action. Four variants, chosen by what the action *does*. |
| **PChip** | A small marker reporting one fact — a turn number, a state, a count. |
| **PPanel** | The bordered box that holds a block of content. |
| **PSectionLabel** | The quiet uppercase heading that names a section. |

Open each one for its own documentation, including when **not** to use it.

## Dark mode is free

There is no `dark:` class anywhere in this package, and there should be none in yours.

Every colour token is defined three times: once for light, once for the operating-system dark
preference, and once for an explicit choice. The theme lives in the **token**, so a component
that writes `bg-surface` is already correct in both themes.

To force a theme, set one attribute:

```ts
document.documentElement.dataset.theme = "dark";   // the whole page
```

It works on a subtree too, because the tokens are inherited custom properties. Every story
here uses that: the "dark" variant is a `<div data-theme="dark">` around the same components.

## The tokens

**Surfaces**, back to front: `ground` → `surface` → `raised`.
**Text**, loudest to quietest: `ink` → `muted` → `faint`.
**Borders**: `hairline`, and `hairline-soft` for dividing rows inside an already-bordered box.
**Meaning**, kept separate from the accent so a rebrand cannot change what "destructive"
looks like: `accent`, `warning`, `danger`, each with a `-soft` tint.

Type is seven named steps rather than picked sizes: `micro`, `meta`, `body`, `prose`,
`title`, `page`, `display`. Use the name for the job.

Three typefaces, self-hosted: a serif for prose, IBM Plex Sans for the interface, IBM Plex
Mono for identifiers and numbers.

## Using it in an application

```css
@import "tailwindcss";
@import "pablo-design-system/styles.css";
@source "../node_modules/pablo-design-system/dist";
```

**That third line is required.** Tailwind skips `node_modules` when it looks for class names.
Without it the package generates no CSS at all — and nothing reports an error. The page just
renders unstyled.

To change the palette, redefine a token after the import:

```css
:root { --color-accent: #2563eb; }
[data-theme="dark"] { --color-accent: #93c5fd; }
```

See the repository README for the full setup, including the one Vite setting a local install
needs.
</docs>
