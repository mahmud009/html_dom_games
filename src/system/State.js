import { createInterval } from "src/utils/create-interval";
import { Vec } from "./Vec";
import { createDistinctEnemies } from "src/utils/create-distinct-enemies";
import { Bullet } from "src/actor/Bullet";

export class State {
  constructor(config) {
    this.actors = [];
    this.config = config;
    this.spawnInterval = createInterval(1000);
    this.spawnCount = 1;
    this.isPaused = false;
  }
  update(delta) {
    if (this.isPaused) return;

    if (this.actors.length == 0) {
      let enemies = createDistinctEnemies(this.config.display);
      this.actors.push(...enemies);
    }

    this.spawnInterval(delta, () => {
      let enemies = createDistinctEnemies(this.config.display);
      this.actors.push(...enemies);
    });

    let bullets = [];
    this.actors.map((enemy) => {
      if (enemy.isFiring && enemy.position.y > 0) {
        let bulletPos = new Vec(
          enemy.position.x,
          enemy.position.y + this.config.enemySize.y / 2
        );
        bullets.push(new Bullet(this.config.bulletSize, bulletPos, 500, 10));
      }
    });
    this.actors.push(...bullets);

    this.actors = this.actors.filter(
      (actor) => actor.position.y <= this.config.display.size.y
    );
    this.actors.forEach((actor) => {
      actor.update(delta);
    });
  }
}
