import { createElement, render } from "../../src";

const tree = createElement(
  "div",
  { id: "app" },
  createElement(
    "h1",
    { onClick: () => console.log("clicked the title") },
    "OverReact.JS",
  ),
  createElement(
    "p",
    { id: "tagline" },
    "A ",
    createElement("strong", {}, "tiny"),
    " React clone.",
  ),
  createElement(
    "ul",
    { id: "list" },
    createElement(
      "li",
      { onClick: () => console.log("describe UI as objects") },
      "describe UI as objects",
    ),
    createElement(
      "li",
      { onClick: () => console.log("render objects to DOM") },
      "render objects to DOM",
    ),
    createElement("li", {}, "diff ", createElement("em", {}, "(coming soon)")),
  ),
  createElement(
    "button",
    { id: "ping", onClick: (event) => console.log("button clicked", event) },
    "ping the console",
  ),
  createElement(
    "footer",
    { id: "foot" },
    createElement("span", {}, "built by hand"),
  ),
);

render(tree, document.getElementById("root"));
