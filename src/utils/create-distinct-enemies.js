import { Vec } from "src/system/Vec";
import { createDiamondFormation } from "./create-diamond-formation";
import { Enemy } from "src/actor/Enemy";
import { displayConfig } from "src/common/display-config";

export function createDistinctEnemies() {
  let coords = [];
  let displaySize = displayConfig.size;
  let cellSize = displayConfig.cellSize;
  const spawnPosition = new Vec(displaySize.x / 2, 0);
  let radius = 4;

  // let enemyCoords = createDiamondFormation(spawnPosition, radius, cellSize);
  let enemyCoords = [new Vec(displaySize.x / 2, 0)];
  coords.push(...enemyCoords);

  return coords.map((coord) => new Enemy(cellSize, coord, 50));
}
