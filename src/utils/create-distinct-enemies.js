import { Vec } from "src/system/Vec";
import { createDiamondFormation } from "./create-diamond-formation";
import { Enemy } from "src/actor/Enemy";

export function createDistinctEnemies(display) {
  let coords = [];
  let displaySize = display.size;
  let cellSize = display.cellSize;
  const spawnPosition = new Vec(displaySize.x / 2, 0);
  let radius = 4;

  let enemyCoords = createDiamondFormation(spawnPosition, radius, cellSize);
  coords.push(...enemyCoords);

  return coords.map((coord) => new Enemy(cellSize, coord, 200));
}
