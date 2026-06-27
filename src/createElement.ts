import type { HostType, HostAttributes, OverReactElement } from "./types";

export function createElement(
  type: HostType,
  props: HostAttributes,
  ...children: (OverReactElement | string)[]
): OverReactElement {
  const normalizedChildren = children.map((child): OverReactElement =>
    typeof child === "string"
      ? {
          type: "TEXT_ELEMENT",
          props: {
            nodeValue: child,
          },
        }
      : child,
  );
  return {
    type,
    props: {
      ...props,
      children: normalizedChildren,
    },
  };
}
