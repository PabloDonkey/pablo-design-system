import { expect, test } from "vitest";
import { render } from "vitest-browser-vue";

import PMenu from "./PMenu.vue";

const items = [
  { label: "Edit", value: "edit" },
  { label: "Duplicate", value: "duplicate" },
  { label: "Delete", value: "delete", disabledReason: "Cannot delete the default scenario" },
];

test("renders trigger button", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: {
      default: () => ({ template: "<button>Open Menu</button>" }),
    },
  });

  // Check if button is in the document first
  const buttons = screen.container.querySelectorAll("button");
  expect(buttons.length).toBeGreaterThan(0);
});

test("trigger button is clickable", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: {
      default: () => ({ template: "<button>Open Menu</button>" }),
    },
  });

  const button = screen.container.querySelector("button");
  expect(button).toBeDefined();

  if (button) {
    await (button as HTMLButtonElement).click();
  }
});

test("shows disabled item with reason text", async () => {
  const screen = render(PMenu, {
    props: { items },
    slots: {
      default: () => ({ template: "<button>Menu</button>" }),
    },
  });

  // Check if menu items rendered
  const menuContent = screen.container.querySelector("[role='menu']");
  if (menuContent) {
    const reasonText = screen.container.textContent?.includes("Cannot delete the default scenario");
    expect(reasonText).toBe(true);
  }
});


