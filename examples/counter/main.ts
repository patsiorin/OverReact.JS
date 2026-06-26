import { createElement, render } from "../../src";

const tree = createElement(
  "div",
  { id: "app" },
  createElement("h1", {}, "OverReact.JS"),
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
    createElement("li", {}, "describe UI as objects"),
    createElement("li", {}, "render objects to DOM"),
    createElement("li", {}, "diff ", createElement("em", {}, "(coming soon)")),
  ),
  createElement(
    "footer",
    { id: "foot" },
    createElement("span", {}, "built by hand"),
  ),
);

render(tree, document.getElementById("root"));
