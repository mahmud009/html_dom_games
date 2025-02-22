import { canvasDisplayConfig, displayConfig } from "src/common/display-config";
import { clamp } from "src/lib/clamp";
import { Vec } from "src/system/Vec";
import { Bullet } from "./Bullet";
import { createInterval } from "src/utils/create-interval";
import { GameState } from "src/system/GameState";

export class Player {
  constructor() {
    this.type = "player";
    const displaySize = canvasDisplayConfig.size;
    this.velocity = new Vec(0, 0);
    this.size = new Vec(16, 16);
    this.position = new Vec(
      displaySize.x / 2,
      displaySize.y - this.size.y / 2 - 2
    );
    this.fireInterval = createInterval(100);
    this.fireSpeed = 600;
    this.isFiring = false;
    this.isDied = false;
    this.dieCircleRadius = 0;
    this.dieAnimDuration = 200;
    this.dieAlphaStart = 1;
    this.dieAnimInterval = createInterval(this.dieAnimDuration);
    this.gameState = GameState.getInstance();
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowRight: false,
      ArrowLeft: false,
    };
  }

  update(delta, gameState) {
    this.listenKeys();
    this.move();
    this.isFiring = false;
    this.fireInterval(delta, () => (this.isFiring = true));
    if (this.isFiring) this.fire();
  }

  listenKeys() {
    const trackKeys = (event, isKeyDown) => {
      if (event.key in this.keys) this.keys[event.key] = isKeyDown;
    };
    window.addEventListener("keydown", (event) => trackKeys(event, true));
    window.addEventListener("keyup", (event) => trackKeys(event, false));
  }

  move() {
    const acceleration = 0.7; // How fast the player accelerates
    const maxSpeed = 10; // Maximum speed
    const damping = 0.7; // Reduces velocity over time (0.9 means 10% reduction per frame)

    // Initialize velocity if not already set
    if (!this.velocity) this.velocity = new Vec(0, 0);

    // Apply acceleration based on input keys
    if (this.keys.ArrowUp) this.velocity.y -= acceleration;
    if (this.keys.ArrowDown) this.velocity.y += acceleration;
    if (this.keys.ArrowRight) this.velocity.x += acceleration;
    if (this.keys.ArrowLeft) this.velocity.x -= acceleration;

    // Apply damping when no input is given (smooth stop)
    if (!this.keys.ArrowUp && !this.keys.ArrowDown) this.velocity.y *= damping;
    if (!this.keys.ArrowLeft && !this.keys.ArrowRight)
      this.velocity.x *= damping;

    // Limit velocity to max speed
    this.velocity.x = clamp(this.velocity.x, -maxSpeed, maxSpeed);
    this.velocity.y = clamp(this.velocity.y, -maxSpeed, maxSpeed);

    // Update position using velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Boundary constraints
    const nextPos = new Vec(this.position.x, this.position.y);
    const displaySize = canvasDisplayConfig.size;
    nextPos.x = clamp(
      nextPos.x,
      this.size.x / 2 + 2,
      displaySize.x - this.size.x / 2 - 2
    );
    nextPos.y = clamp(
      nextPos.y,
      this.size.y / 2 + 2,
      displaySize.y - this.size.y / 2 - 2
    );
    this.position = nextPos;
  }

  fire() {
    let position = new Vec(this.position.x, this.position.y - this.size.y * 2);
    const bullet = new Bullet(4, position, this.fireSpeed, this.type);
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
        this.gameState.isPlayerDied = true;
      });
    } else {
      ctx.fillStyle = "#098b8d"; // Change color if needed
      ctx.strokeStyle = "#2febf0"; // Change color if needed
      ctx.lineWidth = 1; // Set stroke thickness
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
