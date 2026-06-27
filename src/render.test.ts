import { describe, expect, it } from "vitest";

import { createElement } from "./createElement";
import { render } from "./render";

describe("render", () => {
  it("mounts a tree to the DOM", () => {
    const root = document.createElement("div");

    render(
      createElement(
        "div",
        { id: "foo" },
        createElement("span", {}, "hi"),
        "there",
      ),
      root,
    );

    expect(root.innerHTML).toBe('<div id="foo"><span>hi</span>there</div>');
  });

  it("attaches on* props as event listeners, not attributes", () => {
    const root = document.createElement("div");
    let clicks = 0;

    render(createElement("button", { onClick: () => clicks++ }, "x"), root);

    const button = root.querySelector("button");
    button?.dispatchEvent(new MouseEvent("click"));

    expect(clicks).toBe(1);
    expect(root.innerHTML).not.toContain("onClick");
  });
});
