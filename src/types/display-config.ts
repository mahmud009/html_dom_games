import { Vec } from "src/system/Vec";

export interface TDisplayConfig {
  scale: number;
  cellSize: Vec;
  gridSize: Vec;
  get size(): Vec;
}
