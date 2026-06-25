# OverReact.JS

> Building my own clone of React from scratch — to actually understand how it works.

OverReact.JS is an educational reimplementation of a React-style UI library, written in TypeScript. The goal isn't to compete with React; it's to demystify it. By rebuilding the core pieces by hand — element creation, rendering, reconciliation, hooks — I get to understand *why* React is shaped the way it is, instead of taking it on faith.

This repo is a learning journey in progress. Follow along.

## The core idea

React (and this clone) splits the world in two:

- **Describing** the UI — cheap, pure, side-effect-free. `createElement` just turns nested calls into a plain tree of objects (a "virtual DOM"). It touches nothing, renders nothing, knows nothing about the browser.
- **Applying** that description — turning the object tree into real DOM, and later, diffing two trees to make the *minimum* set of changes.

That separation is the whole trick. Because descriptions are cheap, inert data, you can build them freely and compare them efficiently — which is what makes reconciliation possible. Everything in this project hangs off that one idea.

## Roadmap

| # | Milestone | What it does | Status |
|---|-----------|--------------|--------|
| 1 | `createElement` | Turn nested calls into a tree of `{ type, props, children }` objects; wrap raw strings into text nodes | ✅ Done |
| 2 | `render` | Walk the element tree and produce real DOM | ⏳ Next |
| 3 | Naive re-render | Re-render on state change by wiping and rebuilding (intentionally inefficient) | ◻️ Planned |
| 4 | Reconciliation | Diff old vs new tree; touch only what changed — the heart of React | ◻️ Planned |
| 5 | Hooks | `useState`, `useEffect` | ◻️ Planned |

## What works today

`createElement` builds the element tree. There's no JSX and no build step yet — by design. Calling `createElement` by hand keeps the mechanics visible instead of hiding them behind a compiler.

```ts
import { createElement } from "./src";

const tree = createElement("div", { id: "foo" },
  createElement("span", {}, "hello"),
  "world",
);
```

produces:

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
            { "type": "TEXT_ELEMENT", "props": { "nodeValue": "hello" } }
          ]
        }
      },
      { "type": "TEXT_ELEMENT", "props": { "nodeValue": "world" } }
    ]
  }
}
```

Note the two jobs `createElement` does, and *only* these two: it packs everything into a uniform object tree, and it wraps raw strings (`"world"`) into a special `TEXT_ELEMENT` node so that every child has the same shape. Deliberately minimal — the real work lives in the steps that *consume* this tree.

## A note on naming

The vocabulary mirrors React's own internals, because learning the words is part of learning the model:

- **`OverReactElement`** — one node in the virtual tree.
- **Host** (`HostType`, `HostProps`, `HostAttributes`) — a "host component" is a primitive provided by the host platform. In the browser that's the DOM, so `"div"` and `"span"` are host components. React itself is platform-agnostic; the host is whatever it renders into.
- **`TEXT_ELEMENT`** — the synthetic type used to represent raw text as a uniform node.

## Project structure

```
src/
  types.ts          shared vocabulary: OverReactElement, host types
  createElement.ts  Milestone 1
  index.ts          public API barrel
```

## Tech notes

Written in TypeScript with `strict` mode on. The types are intentionally honest: children arrive loose (`OverReactElement | string`) and are normalized to a uniform `OverReactElement[]`, with no type-casting escape hatches.

## License

Released into the public domain under [The Unlicense](./LICENSE). Do whatever you want with it.
