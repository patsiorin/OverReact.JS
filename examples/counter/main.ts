import { createElement, createRoot, requestRender } from "../../src";

// --- State (the M3 hack: a module-level variable; useState replaces this in M5) ---
let count = 0;

// --- UI = f(state): the tree is rebuilt from `count` on every render ---
const App = () =>
  createElement(
    "div",
    { id: "app" },
    createElement("h1", {}, "OverReact.JS"),

    // Text reconciliation: only this text node's value is patched.
    createElement("p", { id: "count" }, `count: ${count}`),
    createElement(
      "button",
      {
        onClick: () => {
          count++;
          requestRender();
        },
      },
      "increment",
    ),

    // PROP reconciliation: the SAME <p> stays in the DOM across renders,
    // and only its `id` attribute is patched:
    //   odd count  -> { id: "danger" }  → CSS turns it red+bold   (prop added/updated)
    //   even count -> {}                → id attribute removed     (prop removed)
    // Open devtools' Elements panel and watch the id attribute toggle
    // on a node that is never recreated.
    createElement(
      "p",
      count % 2 === 1 ? { id: "danger" } : {},
      "status indicator (styled only on odd counts)",
    ),

    // Node-preservation proof: type here, then click increment — your
    // text and cursor survive, because reconciliation reuses this exact node.
    createElement("p", {}, "Type below — your text survives re-renders:"),
    createElement("input", { id: "field" }),
  );

const root = createRoot(document.getElementById("root"));
root.render(App);
