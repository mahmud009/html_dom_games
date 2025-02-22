import { GameState } from "src/system/GameState";

export class Bullet {
  constructor(radius, position, speed, firedBy, color) {
    this.type = "bullet";
    this.firedBy = firedBy;
    this.radius = radius;
    this.position = position;
    this.speed = speed;
    this.color = color;
    this.gameState = GameState.getInstance();
  }

  update(delta) {
    if (this.firedBy === "player") {
      this.position.y -= (this.speed * delta) / 1000;
    } else if (this.firedBy === "enemy") {
      this.position.y += (this.speed * delta) / 1000;
    }

    this.trackCollision(delta);
  }

  trackCollision(delta) {
    if (this.firedBy == "player") {
      const enemies = this.gameState.actors.filter(
        (actor) => actor.type === "enemy"
      );
      enemies.forEach((enemy) => {
        let enemyXStart =
          enemy.position.x - enemy.size.x / 2 - enemy.strokeWidth;
        let enemyXEnd = enemy.position.x + enemy.size.x / 2 + enemy.strokeWidth;
        let enemyYEnd = enemy.position.y + enemy.size.y / 2 + enemy.strokeWidth;
        let bulletXStart = this.position.x - this.radius;
        let bulletXEnd = this.position.x + this.radius;
        let bulletYEnd = this.position.y - this.radius;

        let isCollided =
          (bulletXStart >= enemyXStart || bulletXEnd >= enemyXStart) &&
          (bulletXEnd <= enemyXEnd || bulletXStart <= enemyXEnd) &&
          bulletYEnd <= enemyYEnd;

        if (isCollided) {
          enemy.isDied = true;
          this.gameState.actors = this.gameState.actors.filter(
            (actor) => actor !== this
          );
        }
      });
    }

    if (this.firedBy == "enemy") {
      const player = this.gameState.actors.find(
        (actor) => actor.type === "player"
      );
      if (!player) return;
      let playerXStart = player.position.x - player.size.x / 2;
      let playerXEnd = player.position.x + player.size.x / 2;
      let playerYStart = player.position.y - player.size.y / 2;
      let playerYEnd = player.position.y + player.size.y / 2;
      let bulletXStart = this.position.x - this.radius;
      let bulletXEnd = this.position.x + this.radius;
      let bulletYEnd = this.position.y + this.radius;

      let isCollided =
        (bulletXStart >= playerXStart || bulletXEnd >= playerXStart) &&
        (bulletXEnd <= playerXEnd || bulletXStart <= playerXEnd) &&
        bulletYEnd >= playerYStart &&
        bulletYEnd <= playerYEnd;

      if (isCollided) {
        player.isDied = true;
      }
    }
  }

  draw() {
    const ctx = this.gameState.canvasCtx;
    ctx.fillStyle = this.color || "#ffffff";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI); // Draw a circle

    ctx.closePath();
    ctx.fill();
  }
}
