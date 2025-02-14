import { Vec } from "src/system/Vec";

export function createArrowFormation(center, height, cellSize) {
  let coords = [];
  coords.push(center);
  for (let count = 1; count <= height * 2 - 1; count++) {
    if (count % 2 == 0) {
      let coordY = center.y - cellSize.y * count;
      let coordA = new Vec(center.x - cellSize.x * count, coordY);
      let coordB = new Vec(center.x + cellSize.x * count, coordY);
      coords.push(coordA, coordB);
    }
  }
  return coords;
}
