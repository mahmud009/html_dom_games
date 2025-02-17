import { Vec } from "src/system/Vec";

export const displayConfig = {
  scale: 1,
  cellSize: new Vec(16, 16),
  gridSize: new Vec(16, 32),
  get size() {
    return this.gridSize.multiply(this.cellSize.multiplyScalar(this.scale));
  },
};

export const canvasDisplayConfig = {
  size: new Vec(256, 512),
};
