<script setup lang="ts">
import PButton from "./PButton.vue";
import PToastViewport from "./PToastViewport.vue";
import { useToast } from "./useToast";

const toast = useToast();

function showRetry(): void {
  toast.show({
    tone: "danger",
    text: "Could not send the message",
    duration: 0,
    action: { label: "Retry", onClick: () => toast.show({ text: "Retrying" }) },
  });
}

function showStack(): void {
  toast.show({ text: "Turn 24 saved" });
  toast.show({ tone: "success", text: "Scenario exported" });
  toast.show({ tone: "danger", text: "Could not reach the server" });
}
</script>

<template>
  <Story title="Primitives/PToast" :layout="{ type: 'single' }">
    <Variant title="every tone">
      <div class="flex min-h-64 flex-wrap items-start gap-2 bg-ground p-4">
        <PButton @click="toast.show({ text: 'Saved to your drafts' })">Neutral</PButton>
        <PButton tone="accent" @click="toast.show({ tone: 'success', text: 'Scenario exported' })">
          Success
        </PButton>
        <PButton tone="danger" @click="toast.show({ tone: 'danger', text: 'Could not save' })">
          Danger
        </PButton>
        <PToastViewport />
      </div>
    </Variant>

    <Variant title="stack and action">
      <div class="flex min-h-64 flex-wrap items-start gap-2 bg-ground p-4">
        <PButton @click="showStack">Show three</PButton>
        <PButton @click="showRetry">Show with Retry</PButton>
        <PToastViewport />
      </div>
    </Variant>

    <Variant title="lifted above a pinned bar">
      <div class="min-h-64 bg-ground p-4">
        <PButton @click="toast.show({ text: 'Above the bar' })">Show</PButton>
        <PToastViewport offset="4rem" />
        <div class="fixed inset-x-0 bottom-0 h-12 border-t border-hairline bg-surface p-3 text-meta">
          Pinned action bar
        </div>
      </div>
    </Variant>
  </Story>
</template>

<docs lang="md">
# PToast

A short message that goes away by itself. It has a close button, it can show next to other
toasts, and it can carry one action.

## Use it

Mount one `PToastViewport` near the root of the app, for example in `App.vue`. It takes no
slot. Then call `useToast()` from any code.

```ts
import { useToast } from "pablo-design-system";

const toast = useToast();

const id = toast.show({ tone: "success", text: "Scenario exported" });
toast.show({
  tone: "danger",
  text: "Could not send the message",
  duration: 0,
  action: { label: "Retry", onClick: send },
});
toast.close(id);
toast.clear();
```

Every call to `useToast()` shares one list. The app does not keep its own `ref` or timer.

## `show` options

| Option | Meaning |
|---|---|
| `text` | The message. One short sentence. |
| `tone` | `neutral` (default), `success`, or `danger`. |
| `duration` | Milliseconds. Default 5000. `0` keeps it until the person closes it. |
| `action` | `{ label, onClick }`. Shows a button. The toast closes after `onClick`. |

`show` returns an id. Pass it to `close`.

## `PToastViewport` props

| Prop | Meaning |
|---|---|
| `offset` | The gap above the bottom of the screen. Any CSS length. Default `1rem`. Raise it for a pinned action bar. |
| `label` | The accessible name of the region. Default `Notifications`. |

The offset also comes from the CSS variable `--p-toast-offset`.

## Behaviour

- A `danger` toast has `role="alert"`. The other tones have `role="status"`.
- The timer pauses while the pointer is over the stack and while focus is inside it.
- `F8` moves focus to the stack. `Escape` closes the toasts.
- Motion stops when the person asks for reduced motion.
- `success` uses the accent colour. There is no separate success colour token.

## Do not

- Do not mount more than one `PToastViewport`.
- Do not put a long message in a toast. If it needs reading time, it wants a panel.
</docs>
