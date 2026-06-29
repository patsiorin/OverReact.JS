import { describe, expect, it } from "vitest";

import { createElement } from "../core/createElement";
import { createRoot, requestRender } from "../dom/createRoot";

describe("reconciliation", () => {
  it("preserves an unchanged DOM node across re-renders", () => {
    const container = document.createElement("div");
    let count = 0;

    createRoot(container).render(() =>
      createElement(
        "div",
        {},
        createElement("p", {}, `count: ${count}`),
        createElement("input", { id: "field" }),
      ),
    );

    const inputBefore = container.querySelector("input");
    inputBefore!.value = "typed text"; // live DOM state, not in the vtree

    count++;
    requestRender();

    const inputAfter = container.querySelector("input");
    expect(inputAfter).toBe(inputBefore); // SAME physical node
    expect(inputAfter!.value).toBe("typed text"); // state survived
    expect(container.querySelector("p")!.textContent).toBe("count: 1"); // text updated
  });
});

describe("prop reconciliation", () => {
  it("adds, updates, and removes attributes on a kept node", () => {
    const container = document.createElement("div");
    let id: string | undefined = "first";

    createRoot(container).render(() =>
      createElement("div", id === undefined ? {} : { id }),
    );

    const div = container.querySelector("div");
    expect(div!.getAttribute("id")).toBe("first");

    id = "second"; // changed
    requestRender();
    expect(container.querySelector("div")).toBe(div); // same node
    expect(div!.getAttribute("id")).toBe("second"); // updated

    id = undefined; // removed
    requestRender();
    expect(div!.hasAttribute("id")).toBe(false); // removed
  });
});

describe("event reconciliation", () => {
  it("does not stack listeners across re-renders", () => {
    const container = document.createElement("div");
    let fires = 0;
    let count = 0;

    const root = createRoot(container);
    root.render(() =>
      createElement(
        "button",
        {
          // new closure each render, capturing current count
          onClick: () => {
            fires++;
            void count;
          },
        },
        `count: ${count}`,
      ),
    );

    // force several re-renders so a buggy impl would stack listeners
    count = 1;
    requestRender();
    count = 2;
    requestRender();

    container.querySelector("button")!.dispatchEvent(new MouseEvent("click"));

    expect(fires).toBe(1); // exactly once, not 3x
  });
});
