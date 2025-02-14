import { displayConfig } from "src/common/display-config";
import { clamp } from "src/lib/clamp";
import { Vec } from "src/system/Vec";

export class Player {
  constructor() {
    this.type = "player";
    const displaySize = displayConfig.size;
    this.position = new Vec(displaySize.x / 2, displaySize.y - 16);
    this.velocity = new Vec(0, 0);
    this.size = new Vec(16, 16);
    this.isFiring = false;
    this.gameState = null;
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
    this.isFiring = true;
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
    const playerXHalf = this.size.x / 2;
    const playerYHalf = this.size.y / 2;
    const displaySize = displayConfig.size;
    nextPos.x = clamp(nextPos.x, playerXHalf, displaySize.x - playerXHalf);
    nextPos.y = clamp(nextPos.y, playerYHalf, displaySize.y - playerYHalf);
    this.position = nextPos;
  }
}
