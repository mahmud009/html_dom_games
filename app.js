function random(min, max) {
  let rand = Math.random();
  if (arguments.length > 1) {
    return Math.ceil(rand * (max - min)) + min;
  }
  return Math.ceil(rand * min);
}

function randomPosition(count, xBound, yBound) {
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

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
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

function createInterval(timeout) {
  let elapsed = performance.now();
  let lastTime;
  return function interval(delta, callback) {
    elapsed += delta;
    if (elapsed / timeout >= 1) {
      callback(lastTime);
      elapsed = 0;
    }
  };
}

let interval = createInterval(2000);

class Enemy {
  constructor(position, speed) {
    this.type = "enemy";
    this.position = position;
    this.speed = speed;
    this.isFiring = false;
    this.elapsedTime = 0;

    // setInterval(() => {
    //   this.isFiring = false;
    // }, 500);
    // this.isFiring = false;
  }

  update(delta) {
    this.isFiring = false;
    interval(delta, (lastTime) => {
      this.isFiring = true;
      // setTimeout(() => {
      //   this.isFiring = false;
      // }, 20);
    });

    // this.elapsedTime += delta;
    // if (this.elapsedTime / 1000 >= 1) {
    //   this.isFiring = true;
    //   this.elapsedTime = 0;
    // } else {
    //   this.isFiring = false;
    // }

    // this.isFiring = false;
    this.position.y += (this.speed * delta) / 1000;
  }
}

class Bullet {
  constructor(position, speed, direction) {
    this.type = "bullet";
    this.position = position;
    this.speed = speed;
    this.direction = direction;
  }

  update(delta) {
    this.position.y += (this.speed * delta) / 1000;
  }
}

class State {
  constructor() {
    this.actors = [];
    this.spawnInterval = 2000;
    this.spawnCount = 5;
    this.elapsedTime = 0;
  }
  update(delta) {
    this.elapsedTime += delta;
    // enemies
    if (this.elapsedTime / this.spawnInterval >= 1) {
      let randomCoords = randomPosition(this.spawnCount, 400, -400);
      let enemies = randomCoords.map((coord) => {
        return new Enemy(coord, random(50, 100));
      });
      this.actors.push(...enemies);

      this.elapsedTime = 0;
    }

    let bullets = [];
    this.actors.map((enemy) => {
      if (enemy.isFiring && enemy.position.y > 0) {
        let bulletPos = new Vec(enemy.position.x + 11.5, enemy.position.y + 26);
        bullets.push(new Bullet(bulletPos, enemy.speed * 3, 10));
      }
    });
    this.actors.push(...bullets);

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
    display.sync(() => draw(state.actors));
    requestAnimationFrame(loop);
  }
  loop(lastTime);
}

runGame();
