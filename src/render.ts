import type { OverReactElement } from "./types";

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
      if (attributeName !== "children") {
        element.setAttribute(attributeName, String(attributeValue));
      }
    }

    tree.props.children?.forEach((child) => render(child, element));
    container.appendChild(element);
  }
}
