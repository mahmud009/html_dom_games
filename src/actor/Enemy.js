import { displayConfig } from "src/common/display-config";
import { Vec } from "src/system/Vec";
import { createInterval } from "src/utils/create-interval";
import { Bullet } from "./Bullet";

export class Enemy {
  constructor(size, position, speed) {
    this.type = "enemy";
    this.size = size;
    this.position = position;
    this.speed = speed;
    this.isFiring = false;
    this.interval = createInterval(500);
    this.gameState = null;
  }

  update(delta, gameState) {
    this.gameState = gameState;
    this.isFiring = false;
    this.interval(delta, () => (this.isFiring = true));
    this.position.y += (this.speed * delta) / 1000;
    if (this.isFiring) this.fire();
  }

  fire() {
    let position = new Vec(
      this.position.x,
      this.position.y + displayConfig.cellSize.y / 2
    );
    const size = new Vec(10, 10);
    const bullet = new Bullet(size, position, 100, 10);
    this.gameState.actors.push(bullet);
  }
}
