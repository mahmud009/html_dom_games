import { GameState } from "src/system/GameState";

export class Bullet {
  constructor(size, position, speed, direction) {
    this.type = "bullet";
    this.size = size;
    this.position = position;
    this.speed = speed;
    this.direction = direction;
    this.gameState = GameState.getInstance();
  }

  update(delta) {
    if (this.direction === "up") {
      this.position.y -= (this.speed * delta) / 1000;
    } else if (this.direction === "down") {
      this.position.y += (this.speed * delta) / 1000;
    }
  }

  draw() {
    const ctx = this.gameState.canvasCtx;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 2, 0, 2 * Math.PI); // Draw a circle
    ctx.closePath();
    ctx.stroke();
  }
}
