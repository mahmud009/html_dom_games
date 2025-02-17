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
    this.position = new Vec(displaySize.x / 2, displaySize.y - 16);
    this.velocity = new Vec(0, 0);
    this.size = new Vec(16, 16);
    this.interval = createInterval(300);
    this.isFiring = false;
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
    this.gameState = gameState;
    this.isFiring = false;
    this.interval(delta, () => (this.isFiring = true));
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
    const acceleration = 0.5; // How fast the player accelerates
    const maxSpeed = 3; // Maximum speed
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
    nextPos.x = clamp(nextPos.x, 0, displaySize.x - this.size.x);
    nextPos.y = clamp(nextPos.y, 0, displaySize.y - this.size.y);
    this.position = nextPos;
  }

  fire() {
    const size = new Vec(5, 5);
    let position = new Vec(
      this.position.x + this.size.x / 2 - size.x / 2,
      this.position.y
    );
    const bullet = new Bullet(size, position, 400, "up");
    this.gameState.actors.push(bullet);
  }

  draw() {
    const ctx = this.gameState.canvasCtx;
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#098b8d"; // Change color if needed
    ctx.strokeStyle = "#2febf0"; // Change color if needed
    ctx.lineWidth = 6; // Set stroke thickness
    ctx.lineJoin = "round";

    // Begin drawing the triangle
    ctx.beginPath();
    ctx.moveTo(this.position.x - 24, this.position.y); // First point
    ctx.lineTo(this.position.x + 24, this.position.y); // Second point
    ctx.lineTo(this.position.x, this.position.y - 32); // Third point
    ctx.closePath();

    ctx.fill();
    ctx.stroke();
  }
}
