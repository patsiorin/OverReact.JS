import { describe, expect, it } from "vitest";
import { createElement } from "./createElement";

describe("createElement", () => {
  it("builds a host element with attributes and children", () => {
    const tree = createElement(
      "div",
      { id: "foo" },
      createElement("span", {}, "hello"),
      "world",
    );

    expect(tree).toEqual({
      type: "div",
      props: {
        id: "foo",
        children: [
          {
            type: "span",
            props: {
              children: [
                { type: "TEXT_ELEMENT", props: { nodeValue: "hello" } },
              ],
            },
          },
          { type: "TEXT_ELEMENT", props: { nodeValue: "world" } },
        ],
      },
    });
  });

  it("wraps raw string children into TEXT_ELEMENT nodes", () => {
    const tree = createElement("span", {}, "hi");

    expect(tree).toEqual({
      type: "span",
      props: {
        children: [{ type: "TEXT_ELEMENT", props: { nodeValue: "hi" } }],
      },
    });
  });
});
