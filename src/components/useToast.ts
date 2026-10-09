import { readonly, ref } from "vue";

/** The tones a toast can have. `success` uses the accent tokens. */
export type ToastTone = "neutral" | "success" | "danger";

export interface ToastAction {
  /** The button text, for example "Retry". */
  label: string;
  /** Runs when the person presses the button. The toast closes after it. */
  onClick: () => void;
}

export interface ToastOptions {
  /** The message. Keep it to one short sentence. */
  text: string;
  /** Defaults to `neutral`. A `danger` toast is announced as an alert. */
  tone?: ToastTone;
  /**
   * How long the toast stays, in milliseconds. Defaults to 5000. Use 0 to keep it until
   * the person closes it.
   */
  duration?: number;
  action?: ToastAction;
}

export interface ToastItem {
  id: string;
  text: string;
  tone: ToastTone;
  duration: number;
  action?: ToastAction;
  /** False while the toast plays its exit motion, before it leaves the list. */
  open: boolean;
}

/** How long a closed toast stays in the list so its exit motion can finish. */
const EXIT_MS = 200;
const DEFAULT_DURATION = 5000;

// One list for the whole page, on purpose. The app mounts one `PToastViewport`, and any
// code can show a toast without passing a `ref` around.
const items = ref<ToastItem[]>([]);
const removals = new Map<string, number>();
let counter = 0;

function remove(id: string): void {
  window.clearTimeout(removals.get(id));
  removals.delete(id);
  items.value = items.value.filter((item) => item.id !== id);
}

/**
 * Show toasts from code. Every call shares the same list.
 *
 * ```ts
 * const toast = useToast();
 * toast.show({ tone: "danger", text: "Could not send", action: { label: "Retry", onClick } });
 * ```
 */
export function useToast() {
  function show(options: ToastOptions): string {
    counter += 1;
    const id = `toast-${counter}`;
    items.value = [
      ...items.value,
      {
        id,
        text: options.text,
        tone: options.tone ?? "neutral",
        duration: options.duration ?? DEFAULT_DURATION,
        action: options.action,
        open: true,
      },
    ];
    return id;
  }

  /** Close one toast. An id that is not in the list is ignored. */
  function close(id: string): void {
    const item = items.value.find((entry) => entry.id === id);
    if (!item || !item.open) return;
    item.open = false;
    removals.set(id, window.setTimeout(() => remove(id), EXIT_MS));
  }

  /** Remove every toast at once, with no exit motion. */
  function clear(): void {
    removals.forEach((timer) => window.clearTimeout(timer));
    removals.clear();
    items.value = [];
  }

  return { toasts: readonly(items), show, close, clear };
}
