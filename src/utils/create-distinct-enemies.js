import { Vec } from "src/system/Vec";
import { createDiamondFormation } from "./create-diamond-formation";
import { Enemy } from "src/actor/Enemy";
import { displayConfig } from "src/common/display-config";
import { randomPosition } from "./random-position";

export function createDistinctEnemies() {
  let coords = [];
  let displaySize = displayConfig.size;
  let size = new Vec(16, 16);
  let count = 5;
  let enemyCoords = randomPosition(count, displaySize.x, -displaySize.y);

  console.log(enemyCoords);
  coords.push(...enemyCoords);

  return coords.map((coord) => new Enemy(size, coord, 50));
}
