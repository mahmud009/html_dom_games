import { createInterval } from "src/utils/create-interval";

export class Enemy {
  constructor(size, position, speed) {
    this.type = "enemy";
    this.size = size;
    this.position = position;
    this.speed = speed;
    this.isFiring = false;
    this.interval = createInterval(500);
  }

  update(delta) {
    this.isFiring = false;
    this.interval(delta, () => (this.isFiring = true));
    this.position.y += (this.speed * delta) / 1000;
  }
}
