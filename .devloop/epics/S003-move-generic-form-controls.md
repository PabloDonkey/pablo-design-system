# S003 · Move the generic form controls in

**Status:** 🔵 BLOCKED — deliberately. Waiting on a second consumer, not on effort.
**Depends on:** [S001](../archive/S001-2026-08-28-v0-1-tokens-and-primitives.md).

## The problem this is NOT

rp-engine has seven form controls. It is tempting to move them all here and call it reuse.
v0.1 deliberately moved none, and that decision should hold until something changes.

## What could move, eventually

`TextField` and `OptionCards`. Both are genuinely generic. Neither knows anything about a
scenario.

## What must not move

- **`MetadataField`** edits `Record<string, string | string[]>` — rp-engine's own
  `core/metadata.py` shape. It also carries the S030 fix where its model watcher compares
  JSON, because typing a key used to delete the row being edited.
- **`StringListField`** carries its own fixes, and order is load-bearing for scenario rules.
- **`TextAreaField`** has a chip row that inserts `{{user}}` at the caret. That is
  `ConversationBuilder` vocabulary, not a general text area.

Moving a component away from the test that found its bug is how a hard-won fix gets tidied
away by someone who cannot see why it is there.

## The trigger

**A second consumer.** Not a schedule, and not a tidiness impulse.

One application cannot tell you what a shared text field needs — it can only tell you what
*it* needs, which is already what it has. A second one produces the disagreement that shows
where the real seam is. Guessing before that produces props nobody wants and an API that has
to change the first time it meets a real second case.

## When it does happen

- [ ] Move `TextField` and `OptionCards` with their tests, in one commit each.
- [ ] rp-engine imports them and deletes its copies. Its existing tests must pass unchanged.
- [ ] Neither gains a prop that only one of the two consumers wants.
