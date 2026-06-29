import type { OverReactElement } from "../core/types";
import { createDom, render, setProp } from "../dom/render";

export function reconcile(
  parentDom: HTMLElement,
  oldVNode: OverReactElement | undefined,
  newVNode: OverReactElement | undefined,
  index: number,
): void {
  if (oldVNode === undefined && newVNode !== undefined) {
    render(newVNode, parentDom);
    return;
  }

  if (newVNode === undefined && oldVNode !== undefined) {
    const node = parentDom.childNodes[index];
    node?.remove();
    return;
  }

  if (
    oldVNode !== undefined &&
    newVNode !== undefined &&
    oldVNode.type !== newVNode.type
  ) {
    const oldNode = parentDom.childNodes[index];
    oldNode?.replaceWith(createDom(newVNode));

    return;
  }

  if (
    oldVNode !== undefined &&
    newVNode !== undefined &&
    oldVNode.type === newVNode.type
  ) {
    const oldNode = parentDom.childNodes[index] as HTMLElement | Text;
    if (oldNode) {
      updateNode(oldNode, oldVNode, newVNode);
    }
  }
}
function updateNode(
  node: HTMLElement | Text,
  oldVNode: OverReactElement,
  newVNode: OverReactElement,
) {
  if (
    newVNode.type === "TEXT_ELEMENT" &&
    oldVNode.type === "TEXT_ELEMENT" &&
    oldVNode.props.nodeValue !== newVNode.props.nodeValue
  ) {
    node.textContent = newVNode.props.nodeValue || null;
    return;
  } else {
    if (!(node instanceof HTMLElement)) return;
    if (oldVNode.type === "TEXT_ELEMENT") return;
    if (newVNode.type === "TEXT_ELEMENT") return;

    for (const name of Object.keys(oldVNode.props)) {
      if (name === "children") continue;
      if (!(name in newVNode.props)) {
        node.removeAttribute(name);
      }
    }

    for (const [name, value] of Object.entries(newVNode.props)) {
      if (name === "children") continue;

      const oldValue = (oldVNode.props as Record<string, unknown>)[name];
      if (oldValue === value) continue;

      setProp(node, name, value, oldValue);
    }

    const oldChildren = oldVNode.props.children ?? [];
    const newChildren = newVNode.props.children ?? [];

    const count = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < count; i++) {
      reconcile(node, oldChildren[i], newChildren[i], i);
    }
  }
}
