import { createDomElement } from "./create-dom-element";

export function drawActors(actors) {
  let children = actors.map((child) => {
    let dom = createDomElement("div", { class: `actor ${child.type}` });
    let borderWidth = 2;
    dom.style.width = child.size.x - borderWidth * 2 + "px";
    dom.style.height = child.size.y - borderWidth * 2 + "px";
    dom.style.borderWidth = `${borderWidth}px`;
    dom.style.borderStyle = "solid";
    dom.style.top = child.position.y + "px";
    dom.style.left = child.position.x + "px";
    dom.style.transform = "translate(-50%, -50%)";
    return dom;
  });
  return createDomElement("div", {}, ...children);
}
