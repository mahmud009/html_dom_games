const screen = document.getElementById("game-screen");
const screenWidth = screen.offsetHeight;
const screenHeight = screen.offsetWidth;
const enemyWidth = 15;
const enemyHeight = 15;

function createElement({ name, child }) {
  let element = document.createElement(name);
  if (child != undefined) element.appendChild(child);
  return element;
}

function randomPosition(count) {
  let coords = [];
  for (let i = 0; i < count; i++) {
    const random = () => Math.floor(Math.random() * 360);
    coords.push({ x: random(), y: random() });
  }
  return coords;
}

function createEnemies() {
  let coords = [{ x: 195, y: 195 }];
  // let coords = randomPosition(1);
  coords.forEach((coord) => {
    let enemy = createElement({ name: "div" });
    enemy.classList.add("enemy");
    enemy.style.width = enemyWidth + "px";
    enemy.style.height = enemyHeight + "px";
    enemy.style.top = coord.y + "px";
    enemy.style.left = coord.x + "px";
    screen.append(enemy);

    // 2*Math.PI
    let degToRad = (deg) => deg * (Math.PI / 180);
    let radToDeg = (rad) => rad / (Math.PI / 180);
    let angle = degToRad(15);
    setInterval(() => {
      // angle = degToRad(radToDeg(angle) + 1);
      let currentX = enemy.offsetLeft;
      let currentY = enemy.offsetTop;

      let isEdge =
        currentX <= 0 ||
        currentX >= screenWidth - enemyWidth ||
        currentY <= 0 ||
        currentY >= screenHeight - enemyHeight;

      let x, y;
      if (isEdge) {
        angle = degToRad(-(180 - radToDeg(angle)));
      }

      x = coord.x + Math.sin(angle);
      y = coord.y + Math.cos(angle);
      coord = { x, y };

      enemy.style.top = y + "px";
      enemy.style.left = x + "px";
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
createEnemies();
handleKeyboard();

function test(a, b) {
  console.log(a, b);
}
