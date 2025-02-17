import { createInterval } from "src/utils/create-interval";
import { Vec } from "./Vec";
import { createDistinctEnemies } from "src/utils/create-distinct-enemies";
import { Bullet } from "src/actor/Bullet";
import { gameConfig } from "src/common/game-config";
import { Player } from "src/actor/Player";
import { displayConfig } from "src/common/display-config";

let instance = null;

export class GameState {
  constructor() {
    this.actors = [];
    this.canvasCtx = null;
    this.spawnInterval = createInterval(1000);
    this.spawnCount = 1;
    this.isPlaying = true;
    this.canvasCtx = null;
    instance = this;
  }

  start() {
    this.isPlaying = true;
  }
  pause() {
    this.isPlaying = false;
  }

  static getInstance() {
    if (!instance) instance = new GameState();
    return instance;
  }

  update(delta) {
    const enemies = this.actors.filter((actor) => actor.type === "enemy");
    const player = this.actors.find((actor) => actor.type === "player");
    if (!player) this.actors.push(new Player());

    if (enemies.length == 0) {
      let enemies = createDistinctEnemies();
      this.actors.push(...enemies);
    }

    // this.spawnInterval(delta, () => {
    //   let enemies = createDistinctEnemies();
    //   this.actors.push(...enemies);
    // });

    this.actors = this.actors.filter((actor) => {
      if (actor.type == "player") return true;
      return actor.position.y < displayConfig.size.y;
    });
    this.actors.forEach((actor) => {
      actor.update(delta, this);
    });
  }
}
