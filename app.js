function random(min, max) {
  let rand = Math.random();
  if (arguments.length > 1) {
    return Math.ceil(rand * (max - min)) + min;
  }
  return Math.ceil(rand * min);
}

function randomPosition(count, xBound, yBound) {
  if (count == 1) return { x: random(0, xBound), y: random(0, yBound) };
  let coords = [];
  for (let i = 0; i < count; i++) {
    coords.push({ x: random(0, xBound), y: random(0, yBound) });
  }
  return coords;
}

function randomColor() {
  let chars = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += chars[random(chars.length - 1)];
  }
  return color;
}

function createElement(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}

class Display {
  constructor(parent) {
    this.dom = createElement("div", { id: "display" });
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }
  sync(draw) {
    if (this.actorLayer) this.actorLayer.remove();
    this.actorLayer = draw();
    this.dom.appendChild(this.actorLayer);
  }
}

class Enemy {
  constructor(position, speed, color) {
    this.type = "enemy";
    this.position = position;
    this.speed = speed;
    this.color = color;
  }
  update(delta) {
    let y = (this.position.y += (this.speed * delta) / 1000);
    return new Enemy({ x: this.position.x, y }, this.speed, this.color);
  }
}

function draw(actors) {
  let children = actors.map((child) => {
    let dom = createElement("div", { class: `actor ${child.type}` });
    dom.style.top = child.position.y + "px";
    dom.style.left = child.position.x + "px";
    dom.style.backgroundColor = child.color;
    return dom;
  });
  return createElement("div", {}, ...children);
}

class State {
  constructor() {
    this.actors = [];
    this.elapsedTime = 0;
  }
  update(delta) {
    this.elapsedTime += delta;
    if (this.elapsedTime / 1000 >= 1) {
      let randomCoords = randomPosition(100, 400, -400);
      let newEnemies = randomCoords.map((coord) => {
        return new Enemy(coord, random(100, 200), randomColor());
      });
      this.actors.push(...newEnemies);
      this.elapsedTime = 0;
    }
    this.actors = this.actors.filter((actor) => actor.position.y <= 800);
    this.actors.forEach((actor) => {
      actor.update(delta);
    });
  }
}

function runGame() {
  const displayParent = document.getElementById("wrapper");
  let display = new Display(displayParent);
  let state = new State();

  let lastTime = performance.now();
  function loop(time) {
    let delta = time - lastTime;
    lastTime = time;
    state.update(delta);
    let actors = state.actors;
    display.sync(() => draw(actors));
    requestAnimationFrame(loop);
  }
  loop(lastTime);
}

runGame();
