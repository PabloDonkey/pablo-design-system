# S004 · A dialog

**Status:** 🔵 BLOCKED — no consumer yet.
**Depends on:** [S002](S002-pmenu-reka-dropdown.md), which brings Reka UI in.

## Why it is blocked

rp-engine confirms destructive actions with `window.confirm()` in 8 places: `UsersPage`,
`UserSessionsPage`, `ScenariosPage`, `ScenarioDetailPage`, `ScenarioEditPage`, and three
times in `SessionDetailPage`.

Replacing those is a **behaviour change**, so the work belongs in an rp-engine epic, not
here. This package can only supply the component, and a component with no caller is
speculative work.

## Why it is worth writing down now

`PDialog` is normally the second-strongest reason to take a headless library. Recording that
it has no consumer today is what keeps [S002](S002-pmenu-reka-dropdown.md)'s ledger honest:
Reka currently buys one component, not two.

When the rp-engine epic happens, this unblocks and Reka pays for itself twice over.

## Scope, when it unblocks

- [ ] `PDialog` over Reka's `DialogRoot` / `Trigger` / `Portal` / `Overlay` / `Content` /
      `Title` / `Description` / `Close`.
- [ ] Focus is trapped while open and returns to the trigger on close.
- [ ] `Escape` closes. A destructive dialog does **not** close on an overlay click — that is
      too easy to do by accident.
- [ ] The confirming action names what it will do ("Retire scenario"), never "OK". The
      retire dialog rp-engine already has names its live session count before it asks, and
      that behaviour must survive the move.
- [ ] Tests: reachable by `role="dialog"` with an accessible name; focus trapped; `Escape`
      closes; the destructive variant survives an overlay click.
- [ ] A story, and light and dark baselines.
