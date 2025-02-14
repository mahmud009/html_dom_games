import { Vec } from "src/system/Vec";

export function createDiamondFormation(center, height, cellSize) {
  let coords = [];
  coords.push(center);

  for (let count = 1; count < height; count++) {
    if (count > 0) {
      let distance = height - count;
      let leftX = center.x - distance * cellSize.x;
      let leftY = center.y - count * cellSize.y;
      let rightX = center.x + distance * cellSize.x;
      let rightY = center.y - count * cellSize.y;
      let coordA = new Vec(leftX, leftY);
      let coordB = new Vec(rightX, rightY);
      coords.push(coordA);
      coords.push(coordB);
    }
  }

  return coords;
}
