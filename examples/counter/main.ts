import { createElement, createRoot, requestRender } from "../../src";

// --- State (the M3 hack: a module-level variable; useState replaces this in M5) ---
let count = 0;

// --- UI = f(state): the tree is rebuilt from `count` on every render ---
const App = () =>
  createElement(
    "div",
    { id: "app" },
    createElement("h1", {}, "OverReact.JS"),

    // The counter: clicking mutates state, then asks the runtime to redraw.
    createElement("p", { id: "count" }, `count: ${count}`),
    createElement(
      "button",
      {
        id: "increment",
        onClick: () => {
          count++;
          requestRender();
        },
      },
      "increment",
    ),

    // The demonstration of WHY naive re-render is bad:
    // type something here, then click increment — your text and cursor
    // focus vanish, because replaceChildren() destroys this real <input>
    // node and builds a fresh empty one every render.
    createElement(
      "p",
      { id: "hint" },
      "Type below, then click increment — watch the input reset:",
    ),
    createElement("input", { id: "field" }),

    createElement(
      "footer",
      { id: "foot" },
      createElement("span", {}, "M3: naive re-render (M4 will fix the reset)"),
    ),
  );

const root = createRoot(document.getElementById("root"));
root.render(App);
