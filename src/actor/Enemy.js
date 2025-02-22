import { canvasDisplayConfig, displayConfig } from "src/common/display-config";
import { Vec } from "src/system/Vec";
import { createInterval } from "src/utils/create-interval";
import { Bullet } from "./Bullet";
import { GameState } from "src/system/GameState";
import { randomInRange } from "src/utils/random-in-range";

export class Enemy {
  constructor(size, position, speed) {
    this.type = "enemy";
    this.size = size;
    this.position = position;
    this.strokeWidth = 0;
    this.speed = speed;
    this.isFiring = false;
    this.isDied = false;
    this.dieCircleRadius = 0;
    this.dieAnimDuration = 200;
    this.dieAlphaStart = 1;
    this.dieAnimInterval = createInterval(this.dieAnimDuration);
    this.fireInterval = createInterval(500);
    this.fireSpeed = randomInRange(100, 200);
    this.gameState = GameState.getInstance();
  }

  update(delta) {
    this.isFiring = false;
    this.fireInterval(delta, () => (this.isFiring = true));
    this.position.y += (this.speed * delta) / 1000;
    if (this.isFiring) this.fire();
  }

  fire() {
    if (this.position.y <= 0) return;
    let position = new Vec(this.position.x, this.position.y + this.size.y);
    const bullet = new Bullet(
      3,
      position,
      this.fireSpeed,
      this.type,
      "#F97300"
    );
    this.gameState.actors.push(bullet);
  }

  draw(delta) {
    const ctx = this.gameState.canvasCtx;

    if (this.isDied) {
      ctx.fillStyle = "#524C42";
      ctx.save();
      this.dieAlphaStart -= delta / this.dieAnimDuration;
      if (this.dieAlphaStart < 0) this.dieAlphaStart = 0;
      ctx.globalAlpha = this.dieAlphaStart; // Apply the opacity

      this.dieCircleRadius += 20 / (this.dieAnimDuration / delta);
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.dieCircleRadius,
        0,
        2 * Math.PI
      ); // Draw a circle
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      this.dieAnimInterval(delta, () => {
        this.gameState.actors = this.gameState.actors.filter(
          (actor) => actor !== this
        );
      });
    } else {
      ctx.fillStyle = "#9a2674";
      ctx.strokeStyle = "#e735ad"; // Change color if needed
      ctx.lineWidth = this.strokeWidth; // Set stroke thickness
      ctx.lineJoin = "round";

      // Begin drawing the square
      ctx.beginPath();

      // Top-left corner
      ctx.moveTo(
        this.position.x - this.size.x / 2,
        this.position.y - this.size.y / 2
      );
      // Top-right corner
      ctx.lineTo(
        this.position.x + this.size.x / 2,
        this.position.y - this.size.y / 2
      );
      // Bottom-right corner
      ctx.lineTo(
        this.position.x + this.size.x / 2,
        this.position.y + this.size.y / 2
      );
      // Bottom-left corner
      ctx.lineTo(
        this.position.x - this.size.x / 2,
        this.position.y + this.size.y / 2
      );
      ctx.closePath();

      ctx.fill();
      ctx.stroke();
    }
  }
}
