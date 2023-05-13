const container = document.getElementById("anim_container");
const width = container.offsetHeight;
const height = container.offsetWidth;

function randomPosition(count) {
  let coords = [];
  for (let i = 0; i < count; i++) {
    const random = () => Math.floor(Math.random() * 400);
    coords.push({ x: random(), y: random() });
  }
  return coords;
}

function createFoods() {
  let coords = randomPosition(10);
  coords.forEach((coord) => {
    console.log(coord);
    let food = document.createElement("div");
    food.classList.add("food");
    food.style.top = coord.y + "px";
    food.style.left = coord.x + "px";
    container.append(food);
  });
}

function createPlayer() {
  let player = document.createElement("div");
  player.classList.add("player");
  player.setAttribute("id", "player");
  container.append(player);
}

function handleKeyboard() {
  let speed = 15;
  window.addEventListener("keydown", function (event) {
    // console.log(event);
    let player = document.getElementById("player");
    if (event.code == "ArrowRight") {
      console.log(player.offsetLeft);
      console.log(player.offsetLeft >= width);
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
createFoods();
handleKeyboard();
