import type { OverReactElement } from "../core/types";
import { reconcile } from "../reconciler/reconcile";

let activeUpdate: (() => void) | null = null;

export function createRoot(container: HTMLElement | null) {
  if (container === null) {
    throw new Error("Container is null");
  }

  let prevTree: OverReactElement | undefined;

  let component: () => OverReactElement;

  const update = () => {
    const newTree = component();
    reconcile(container, prevTree, newTree, 0);
    prevTree = newTree;
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
