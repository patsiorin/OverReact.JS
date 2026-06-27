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

  if (tree.type === "TEXT_ELEMENT") {
    container.appendChild(document.createTextNode(tree.props.nodeValue || ""));
  } else {
    const element = document.createElement(tree.type);

    for (const [attributeName, attributeValue] of Object.entries(tree.props)) {
      if (attributeName === "children") {
        continue;
      }

      if (isEventProp(attributeName) && typeof attributeValue === "function") {
        element.addEventListener(
          EVENT_PROPS[attributeName],
          attributeValue as EventListener,
        );
      } else {
        element.setAttribute(attributeName, String(attributeValue));
      }
    }

    tree.props.children?.forEach((child) => render(child, element));
    container.appendChild(element);
  }
}
