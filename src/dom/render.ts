import type { OverReactElement } from "../core/types";
import { EVENT_PROPS } from "./events";

function isEventProp(key: string): key is keyof typeof EVENT_PROPS {
  return key in EVENT_PROPS;
}

export function render(
  tree: OverReactElement,
  container: HTMLElement | null,
): void {
  if (container == null) return;

  const node = createDom(tree);
  container.appendChild(node);
}

export function createDom(tree: OverReactElement): Text | HTMLElement {
  if (tree.type === "TEXT_ELEMENT") {
    return document.createTextNode(tree.props.nodeValue || "");
  } else {
    const element = document.createElement(tree.type);

    for (const [attributeName, attributeValue] of Object.entries(tree.props)) {
      if (attributeName === "children") {
        continue;
      }

      setProp(element, attributeName, attributeValue);
    }

    tree.props.children?.forEach((child) => {
      element.appendChild(createDom(child));
    });

    return element;
  }
}

export function setProp(
  element: HTMLElement,
  attributeName: string,
  attributeValue: unknown,
  oldValue?: unknown,
): void {
  if (isEventProp(attributeName) && typeof attributeValue === "function") {
    if (typeof oldValue === "function") {
      element.removeEventListener(
        EVENT_PROPS[attributeName],
        oldValue as EventListener,
      );
    }
    element.addEventListener(
      EVENT_PROPS[attributeName],
      attributeValue as EventListener,
    );
  } else {
    element.setAttribute(attributeName, String(attributeValue));
  }
}
