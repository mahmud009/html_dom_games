export class Bullet {
  constructor(size, position, speed, direction) {
    this.type = "bullet";
    this.size = size;
    this.position = position;
    this.speed = speed;
    this.direction = direction;
  }

  update(delta) {
    this.position.y += (this.speed * delta) / 1000;
  }
}
