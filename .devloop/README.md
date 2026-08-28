# .devloop — development loop tracking

Tactical execution tracking, committed to git. Same convention as rp-engine, so there is one
thing to learn.

```
.devloop/
  BOARD.md                          the kanban you glance at
  epics/S###-<slug>.md              checklist per ACTIVE epic
  archive/S###-YYYY-MM-DD-<slug>.md FROZEN finished epics — never edit
```

Story ids are per repository and monotonic. Next number:

```bash
ls .devloop/epics .devloop/archive | grep -oE 'S[0-9]+' | sort -u | tail -1
```
