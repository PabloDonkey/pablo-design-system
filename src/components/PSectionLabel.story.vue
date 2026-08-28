<script setup lang="ts">
import PSectionLabel from "./PSectionLabel.vue";
</script>

<template>
  <Story title="Primitives/PSectionLabel" :layout="{ type: 'grid', width: 420 }">
    <Variant title="sizes">
      <div class="flex flex-col gap-3 bg-ground p-4">
        <PSectionLabel size="md">Medium — section heading</PSectionLabel>
        <PSectionLabel size="sm">Small — eyebrow</PSectionLabel>
      </div>
    </Variant>

    <Variant title="dark">
      <div data-theme="dark" class="flex flex-col gap-3 bg-ground p-4">
        <PSectionLabel size="md">Medium — section heading</PSectionLabel>
        <PSectionLabel size="sm">Small — eyebrow</PSectionLabel>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PSectionLabel

The quiet uppercase heading that names a section. It replaced 29 hand-written copies of the
same class string in the rp-engine admin panel.

It is deliberately small and muted. It is a signpost, not a title — the content under it
should be what the eye lands on.

## It is a heading, and that matters

By default this renders `<h2>`, not a styled `<span>`. Headings are how a screen-reader user
moves through a page: they jump heading to heading rather than reading it top to bottom. A
page whose sections are all `<div>`s has no outline to move through.

## Choosing the level

Use `as` to fit the page you are on. A design system cannot know what sits above your
section, so it cannot pick for you.

- `h2` — a top-level section on a page whose title is `h1`. The default.
- `h3` — a section inside another section.
- `span` — **only** when it is genuinely not a heading. A column label in a repeated row, for
  example, where 40 real headings would flood the outline with noise.

Do not skip levels to get a size. Level is structure; `size` is appearance, and they are
separate props for that reason.

## Sizes

- `md` — the default, for a real section heading.
- `sm` — an eyebrow above a small block, or a label in a dense row.

## Do not

- Do not write it in capitals yourself. The component applies `uppercase`, so the text stays
  readable in the source and a screen reader does not spell it out letter by letter.
- Do not use it for body text that happens to be small and grey. That is `text-muted`.
</docs>
