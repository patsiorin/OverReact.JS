# OverReact.JS

> Building my own clone of React from scratch — to actually understand how it works.

OverReact.JS is an educational reimplementation of a React-style UI library, written in TypeScript. The goal isn't to compete with React; it's to demystify it. By rebuilding the core pieces by hand — element creation, rendering, reconciliation, hooks — I get to understand _why_ React is shaped the way it is, instead of taking it on faith.

This repo is a learning journey in progress. Follow along.

## The core idea

React (and this clone) splits the world in two:

- **Describing** the UI — cheap, pure, side-effect-free. `createElement` just turns nested calls into a plain tree of objects (a "virtual DOM"). It touches nothing, renders nothing, knows nothing about the browser.
- **Applying** that description — turning the object tree into real DOM, and later, diffing two trees to make the _minimum_ set of changes.

That separation is the whole trick. Because descriptions are cheap, inert data, you can build them freely and compare them efficiently — which is what makes reconciliation possible. Everything in this project hangs off that one idea.

## Roadmap

| #   | Milestone                | What it does                                                                                                                | Status  |
| --- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | `createElement`          | Turn nested calls into a tree of `{ type, props, children }` objects; wrap raw strings into text nodes                      | ✅ Done |
| 2   | `render`                 | Walk the element tree and produce real DOM                                                                                  | ✅ Done |
| 3   | Events + naive re-render | Attach `on*` handlers; `createRoot` runtime re-renders on state change by wiping and rebuilding (intentionally inefficient) | ✅ Done |
| 4   | Reconciliation           | Diff old vs new tree; touch only what changed — the heart of React                                                          | ✅ Done |
| 5   | Hooks                    | `useState`, `useEffect`                                                                                                     | ⏳ Next |

## What works today

You can build an element tree with `createElement`, mount it with the `createRoot` runtime, wire up event handlers, and re-render on state change. There's no JSX and no build step for the library itself — by design. Calling `createElement` by hand keeps the mechanics visible instead of hiding them behind a compiler.

```ts
import { createElement, createRoot, requestRender } from "./src";

let count = 0;

const App = () =>
  createElement(
    "div",
    { id: "app" },
    createElement("p", {}, `count: ${count}`),
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
  );

const root = createRoot(document.getElementById("root"));
root.render(App);
```

Under the hood, `createElement` does exactly two jobs and _only_ these two: it packs everything into a uniform object tree, and it wraps raw strings into a special `TEXT_ELEMENT` node so every child has the same shape. For example:

```jsonc
{
  "type": "div",
  "props": {
    "id": "foo",
    "children": [
      {
        "type": "span",
        "props": {
          "children": [
            { "type": "TEXT_ELEMENT", "props": { "nodeValue": "hello" } },
          ],
        },
      },
      { "type": "TEXT_ELEMENT", "props": { "nodeValue": "world" } },
    ],
  },
}
```

Then `render` walks that tree and produces real DOM: it creates a node per element (text nodes for `TEXT_ELEMENT`), sets attributes, attaches `on*` props as event listeners via an event registry, recurses into children, and mounts. The `createRoot` runtime owns re-rendering: `root.render(App)` mounts a component (a function returning a tree), and `requestRender()` triggers a redraw.

Re-rendering no longer rebuilds the DOM. The `createRoot` runtime keeps the previously rendered tree, and on each update **reconciles** it against the new one: `reconcile` walks both trees and applies the minimal set of DOM changes — creating, removing, or replacing nodes, patching text and attributes, and adding/removing event listeners (with remove-then-add so handlers never stack). Because unchanged nodes are reused rather than recreated, live DOM state — input focus, typed text, scroll position — survives across re-renders.

## Running the demo

```bash
npm install
npm run dev
```

This serves the `examples/counter` app with Vite. Open the printed URL and click _increment_: the count text updates, the status line's `id` toggles (red on odd counts) — patched on a node that's never recreated — and anything you type into the input survives every re-render. Open devtools' Elements panel to watch the minimal DOM changes.

## A note on naming

The vocabulary mirrors React's own internals, because learning the words is part of learning the model:

- **`OverReactElement`** — one node in the virtual tree.
- **Host** (`HostType`, `HostProps`, `HostAttributes`) — a "host component" is a primitive provided by the host platform. In the browser that's the DOM, so `"div"` and `"span"` are host components. React itself is platform-agnostic; the host is whatever it renders into.
- **`TEXT_ELEMENT`** — the synthetic type used to represent raw text as a uniform node.
- **Event registry** (`EVENT_PROPS`) — a map from handler prop names (`onClick`) to DOM event names (`"click"`), used as the single source of truth for both runtime detection and deriving handler types.

## Project structure

The source is split along React's main seam: `core/` is the platform-agnostic "describe" layer (knows nothing about the DOM); `dom/` is the "apply" layer that touches the browser; `reconciler/` diffs trees and drives the DOM updates.

```
src/
  core/             # the "describe" layer — platform-agnostic
    createElement.ts  Milestone 1
    types.ts          shared vocabulary: OverReactElement, host + handler types
  dom/              # the "apply" layer — touches the browser
    render.ts         Milestone 2 — mount a tree to the DOM (createDom + setProp)
    events.ts         event registry (prop name -> DOM event name)
    createRoot.ts     Milestone 3 — runtime that owns re-rendering
  reconciler/       # the diffing layer
    reconcile.ts      Milestone 4 — diff old vs new tree, patch the DOM minimally
  index.ts          public API barrel
examples/
  counter/          demo app served by Vite
```

Tests are colocated next to the code they cover (e.g. `core/createElement.test.ts`).

## Tech notes

Written in TypeScript with `strict` mode on. The types are intentionally honest: children arrive loose (`OverReactElement | string`) and are normalized to a uniform `OverReactElement[]`. Event handler types are _derived_ from the event registry via `HTMLElementEventMap`, so they stay precise (an `onClick` handler receives a real `PointerEvent`) without manual upkeep. Casts are avoided except where they encode a runtime invariant the type system genuinely can't express.

## License

Released into the public domain under [The Unlicense](./LICENSE). Do whatever you want with it.
