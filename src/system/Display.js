import { displayConfig } from "src/common/display-config";
import { createDomElement } from "src/utils/create-dom-element";

export class Display {
  constructor(parent) {
    this.config = displayConfig;
    this.size = this.config.size;
    this.dom = createDomElement("div", { id: "display" });
    // this.dom = createDomElement("canvas", { id: "display" });
    // this.canvasCtx = this.dom.getContext("2d");
    this.dom.style.width = this?.size?.x + "px";
    this.dom.style.height = this.size.y + "px";
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }
  sync(draw) {
    console.log(this.actorLayer);
    if (this.actorLayer) this.actorLayer.remove();
    // this.canvasCtx.clearRect(0, 0, this.size.x, this.size.y);
    this.actorLayer = draw();
    this.dom.appendChild(this.actorLayer);
  }
}

export class CanvasDisplay {
  constructor(parent) {
    this.config = displayConfig;
    this.size = this.config.size;
    this.dom = createDomElement("canvas", { id: "display" });
    this.canvasCtx = this.dom.getContext("2d");
    this.dom.width = this.size.x;
    this.dom.height = this.size.y;
    parent.appendChild(this.dom);
  }
  sync(draw) {
    this.canvasCtx.clearRect(0, 0, this.size.x, this.size.y);
    draw();
  }
}
