import type { OverReactElement } from "../core/types";
import { render as mount } from "./render";

let activeUpdate: (() => void) | null = null;

export function createRoot(container: HTMLElement | null) {
  if (container === null) {
    throw new Error("Container is null");
  }

  let component: () => OverReactElement;

  const update = () => {
    container.replaceChildren();
    mount(component(), container);
  };

  return {
    render(c: () => OverReactElement) {
      component = c;
      activeUpdate = update;
      update();
    },
  };
}

export function requestRender() {
  activeUpdate?.();
}
