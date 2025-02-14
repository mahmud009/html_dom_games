import { createDomElement } from "src/utils/create-dom-element";

export class Display {
  constructor(config, parent) {
    this.config = config;
    this.size = this.config.size;
    this.dom = createDomElement("div", { id: "display" });
    this.dom.style.width = this?.size?.x + "px";
    this.dom.style.height = this.size.y + "px";
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }
  sync(draw) {
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = draw();
    this.dom.appendChild(this.actorLayer);
  }
}
