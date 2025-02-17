import { canvasDisplayConfig, displayConfig } from "src/common/display-config";
import { Vec } from "src/system/Vec";
import { createInterval } from "src/utils/create-interval";
import { Bullet } from "./Bullet";
import { GameState } from "src/system/GameState";

export class Enemy {
  constructor(size, position, speed) {
    this.type = "enemy";
    this.size = size;
    this.position = position;
    this.speed = speed;
    this.isFiring = false;
    this.interval = createInterval(500);
    this.gameState = GameState.getInstance();
  }

  update(delta) {
    this.isFiring = false;
    this.interval(delta, () => (this.isFiring = true));
    this.position.y += (this.speed * delta) / 1000;
    if (this.isFiring) this.fire();
  }

  fire() {
    const size = new Vec(5, 5);
    let position = new Vec(
      this.position.x + this.size.x / 2 - size.x / 2,
      this.position.y + this.size.y
    );
    const bullet = new Bullet(size, position, 100, "down");
    this.gameState.actors.push(bullet);
  }

  draw() {
    const ctx = this.gameState.canvasCtx;
    ctx.fillStyle = "#9a2674";
    ctx.strokeStyle = "#e735ad"; // Change color if needed
    ctx.lineWidth = 6; // Set stroke thickness
    ctx.lineJoin = "round";

    // Begin drawing the triangle
    ctx.beginPath();
    ctx.moveTo(this.position.x + 24, this.position.y); // First point
    ctx.lineTo(this.position.x - 24, this.position.y); // Second point
    ctx.lineTo(this.position.x, this.position.y + 32); // Third point
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
  }
}
