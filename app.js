const screen = document.getElementById("game-screen");
const screenWidth = screen.offsetHeight;
const screenHeight = screen.offsetWidth;

function createElement({ name, child }) {
  let element = document.createElement(name);
  if (child != undefined) element.appendChild(child);
  return element;
}

function randomPosition(count) {
  let coords = [];
  for (let i = 0; i < count; i++) {
    const random = () => Math.floor(Math.random() * 400);
    coords.push({ x: random(), y: random() });
  }
  return coords;
}

function createEnemies() {
  let coords = randomPosition(2000);
  coords.forEach((coord) => {
    let food = createElement({ name: "div" });
    food.classList.add("food");
    food.style.top = coord.y + "px";
    food.style.left = coord.x + "px";
    screen.append(food);
    setInterval(() => {
      food.style.left = food.offsetLeft + 1 + "px";
    }, 100);
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
      console.log(player.offsetLeft);
      console.log(player.offsetLeft >= screenWidth);
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

createPlayer();
createEnemies();
handleKeyboard();
