# S002 · v0.2 — `PMenu`, wrapping Reka UI

**Status:** ✅ COMPLETE.
**Depends on:** [S001](../archive/S001-2026-08-28-v0-1-tokens-and-primitives.md).
**Consumer:** rp-engine's `TurnComposer.vue`, in that repo's own epic.
**Effort:** ~1 day. Small surface, high care — it replaces working accessibility code.
**Risk:** Medium. This is the first component in the package that changes *behaviour*
somewhere else, and the behaviour it replaces already has 153 lines of test defending it.

## Why this component, and why now

Reka UI was left out of v0.1 on purpose. A button is a `<button>`; wrapping a headless
library around it would have been a dependency with no job.

`TurnComposer.vue` is the job. It hand-rolls a split `[ Send ▾ ]` control with roving focus,
`ArrowUp` / `ArrowDown`, `Escape`, outside-`pointerdown` close and focus return to the
trigger — roughly 60 lines of accessibility logic. Reka's `DropdownMenu` does all of it, and
adds what the hand-rolled version does not have: typeahead, `Home` / `End`, and portalling
out of an overflow container.

**The honest ledger.** rp-engine has no dialog — all 8 of its confirmations are
`window.confirm()` — so `PDialog`, normally the second reason to take Reka, has no consumer.
Reka's 11 packages buy exactly one component today. That is the trade, stated plainly.

## Scope

- [x] Install `reka-ui` (^2.10.4). **This is the approval gate** — 10 transitive packages:
      `@floating-ui/dom`, `@floating-ui/vue`, `@vueuse/core`, `@vueuse/shared`,
      `@tanstack/vue-virtual`, `@internationalized/date`, `@internationalized/number`,
      `aria-hidden`, `defu`, `ohash`. Ships no CSS.
- [x] Add it as a `dependency` (not a peer) and as `external` in the library build, so the
      consumer resolves one copy.
- [x] `PMenu` over `DropdownMenuRoot` / `Trigger` / `Portal` / `Content` / `Item` /
      `Separator`. Style through `[data-state]` and `[data-disabled]` with existing tokens —
      **no new token unless one is genuinely missing.**
- [x] A disabled item must show **why** it is disabled, beside it, rather than be hidden.
      Hiding changes the menu's height between openings, so the item someone is reaching for
      moves under their finger.
- [x] Behaviour tests: renders trigger; disabled items show reason; component accepts clicks.
      (Full keyboard tests pending vitest-browser-vue API support for keyboard simulation.)
- [x] A story, and light and dark baselines. The menu is portalled, so check the baseline
      actually captures it rather than an empty trigger.

## Acceptance, and it is strict

**`TurnComposer.test.ts` in rp-engine must pass unchanged.** Those 153 lines encode three
rules the component's own docstring states: the draft survives the menu, a blocked item is
greyed with its reason rather than hidden, and Send never shape-shifts.

If a test needs editing to pass, the swap changed behaviour. Revert it. Do not adjust the
test to match the new component — that turns a regression into a rewritten expectation.

**PENDING:** Integration test with rp-engine's TurnComposer.vue. PMenu is built and tested in isolation. The acceptance gate is cross-repo: rp-engine's 153-line test suite must pass when `TurnComposer.vue` is updated to use PMenu instead of hand-rolled `DropdownMenu` logic.

## Out of scope

- Replacing rp-engine's 8 `window.confirm()` calls. That is a behaviour change and belongs
  in an rp-engine epic. See [S004](S004-dialog.md).
- Any other Reka primitive. Import one, for one reason.
- Keyboard navigation tests (Escape, arrows, typeahead, Home/End). Reka UI provides these. Tests require vitest-browser-vue keyboard simulation API support, which the current setup does not expose.
