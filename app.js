const screen = document.getElementById("game-screen");

screen.style.width = 400 + "px";
screen.style.height = 400 + "px";
const screenWidth = screen.offsetHeight;
const screenHeight = screen.offsetWidth;
const enemyWidth = 15;
const enemyHeight = 15;
const degToRad = (deg) => deg * (Math.PI / 180);
const radToDeg = (rad) => rad / (Math.PI / 180);

function createElement({ name, child }) {
  let element = document.createElement(name);
  if (child != undefined) element.appendChild(child);
  return element;
}

function randomPosition(count) {
  let coords = [];
  for (let i = 0; i < count; i++) {
    const random = () => Math.floor(Math.random() * (screenWidth - enemyWidth));
    coords.push({ x: random(), y: random() });
  }
  return coords;
}

function randomHexColor() {
  let chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  let hex = "";
  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * (chars.length - 1))];
  }
  return "#" + hex;
}

function createEnemies() {
  // let coords = [{ x: 195, y: 195 }];
  let coords = randomPosition(50);
  coords.forEach((coord) => {
    let enemy = createElement({ name: "div" });
    enemy.classList.add("enemy");
    enemy.style.width = enemyWidth + "px";
    enemy.style.height = enemyHeight + "px";
    enemy.style.top = coord.y + "px";
    enemy.style.left = coord.x + "px";
    enemy.style.backgroundColor = randomHexColor();
    screen.append(enemy);

    let angle = degToRad(Math.floor(Math.random() * 360));
    setInterval(() => {
      // angle = degToRad(radToDeg(angle) + 1);
      let currentX = enemy.offsetLeft;
      let currentY = enemy.offsetTop;
      let isHorizEdge = currentX <= 0 || currentX >= screenWidth - enemyWidth;
      let isVertAge = currentY <= 0 || currentY >= screenHeight - enemyHeight;
      let newX, newY;
      if (isVertAge) angle = degToRad(180 - radToDeg(angle));
      if (isHorizEdge) angle = degToRad(360 - radToDeg(angle));

      newX = coord.x + Math.sin(angle);
      newY = coord.y + Math.cos(angle);
      coord = { x: newX, y: newY };

      enemy.style.top = newY + "px";
      enemy.style.left = newX + "px";
    }, 10);
  });
}

function createPlayer() {
  let player = document.createElement("div");
  player.classList.add("player");
  player.setAttribute("id", "player");
  screen.append(player);
}

function handleKeyboard() {
  let speed = 15;
  window.addEventListener("keydown", function (event) {
    // console.log(event);
    let player = document.getElementById("player");
    if (event.code == "ArrowRight") {
      player.style.left = player.offsetLeft + speed + "px";
    }
    if (event.code == "ArrowLeft") {
      player.style.left = player.offsetLeft - speed + "px";
    }
    if (event.code == "ArrowUp") {
      player.style.top = player.offsetTop - speed + "px";
    }
    if (event.code == "ArrowDown") {
      player.style.top = player.offsetTop + speed + "px";
    }
  });
}

// createPlayer();
// createEnemies();
// handleKeyboard();

const canvas = document.getElementById("game-canvas");
canvas.style.width = 400 + "px";
canvas.style.height = 400 + "px";
canvas.style.backgroundColor = "#5c469c";

class Enemy {
  constructor(pos) {
    this.dom = createElement({ name: "div" });
    this.pos = pos;
    this.dom.classList.add("enemy");
    this.dom.style.width = enemyWidth + "px";
    this.dom.style.height = enemyHeight + "px";
    this.dom.style.top = pos.y + "px";
    this.dom.style.left = pos.x + "px";
    this.dom.style.backgroundColor = randomHexColor();
    screen.append(this.dom);
  }

  move() {
    let currentX = this.dom.offsetLeft;
    let currentY = this.dom.offsetTop;
    let isHorizEdge = currentX <= 0 || currentX >= screenWidth - enemyWidth;
    let isVertAge = currentY <= 0 || currentY >= screenHeight - enemyHeight;
    let newX, newY;
    if (isVertAge) angle = degToRad(180 - radToDeg(angle));
    if (isHorizEdge) angle = degToRad(360 - radToDeg(angle));

    newX = this.pos.x + Math.sin(angle);
    newY = this.pos.y + Math.cos(angle);
    this.pos = { x: newX, y: newY };

    this.dom.style.top = newY + "px";
    this.dom.style.left = newX + "px";
  }

  update() {}
}

let enemy = new Enemy({ x: 200, y: 200 });
let angle = degToRad(Math.floor(Math.random() * 360));

function animate() {
  enemy.move();
  requestAnimationFrame(animate);
}

animate();
