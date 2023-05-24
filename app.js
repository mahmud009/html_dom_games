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

function createInterval(timeout) {
  let elapsed = performance.now();
  return function interval(delta, callback) {
    elapsed += delta;
    if (elapsed / timeout >= 1) {
      callback();
      elapsed = 0;
    }
  };
}

function draw(actors) {
  let children = actors.map((child) => {
    let dom = createElement("div", { class: `actor ${child.type}` });
    dom.style.width = child.size.x + "px";
    dom.style.height = child.size.y + "px";
    dom.style.top = child.position.y + "px";
    dom.style.left = child.position.x + "px";
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

class Enemy {
  constructor(size, position, speed) {
    this.type = "enemy";
    this.size = size;
    this.position = position;
    this.speed = speed;
    this.isFiring = false;
    this.interval = createInterval(500);
  }

  update(delta) {
    this.isFiring = false;
    this.interval(delta, () => (this.isFiring = true));
    this.position.y += (this.speed * delta) / 1000;
  }
}

class Bullet {
  constructor(size, position, speed, direction) {
    this.type = "bullet";
    this.size = size;
    this.position = position;
    this.speed = speed;
    this.direction = direction;
  }

  update(delta) {
    this.position.y += (this.speed * delta) / 1000;
  }
}

let result = [];
for (let i = 0; i < 5; i++) {
  let isInvalid = false;
  while (!isInvalid) {
    let rand = random(1, 20);
    if (result.length == 0) {
      result.push(rand);
      isInvalid = true;
    } else {
      result.map((itm) => {
        if (itm + 4 < rand && itm - 4 > rand) {
          result.push(rand);
          isInvalid = true;
        }
      });
    }
    isInvalid = true;
  }
}
console.log(result);

function createEnemies(count, size) {
  let randomCoords = randomPosition(count, 400, -100);
  let enemies = randomCoords.map((coord) => {
    return new Enemy(size, coord, random(100, 300));
  });
  return enemies;
}

class State {
  constructor(config) {
    this.actors = [];
    this.config = config;
    this.spawnInterval = createInterval(2000);
    this.spawnCount = 5;
  }
  update(delta) {
    this.spawnInterval(delta, () => {
      let enemies = createEnemies(this.spawnCount, this.config.enemySize);
      this.actors.push(...enemies);
    });

    let bullets = [];
    this.actors.map((enemy) => {
      if (enemy.isFiring && enemy.position.y > 0) {
        let bulletPos = new Vec(
          enemy.position.x + enemy.size.x / 2,
          enemy.position.y + enemy.size.y
        );
        bullets.push(new Bullet(this.config.bulletSize, bulletPos, 500, 10));
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
  let state = new State({
    enemySize: new Vec(10, 24),
    bulletSize: new Vec(10, 10),
  });

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
