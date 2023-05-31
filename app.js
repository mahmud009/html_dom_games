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
    let borderWidth = 2;
    dom.style.width = child.size.x - borderWidth * 2 + "px";
    dom.style.height = child.size.y - borderWidth * 2 + "px";
    dom.style.borderWidth = borderWidth;
    dom.style.top = child.position.y + "px";
    dom.style.left = child.position.x + "px";
    dom.style.transform = "translate(-50%, -50%)";
    return dom;
  });
  return createElement("div", {}, ...children);
}

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  multiplyScalar(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
  multiply(vec) {
    return new Vec(this.x * vec.x, this.y * vec.y);
  }
}

class Display {
  constructor(config, parent) {
    this.config = config;
    this.size = this.config.size;
    this.dom = createElement("div", { id: "display" });
    this.dom.style.width = this.size.x + "px";
    this.dom.style.height = this.size.y + "px";
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
    // this.interval(delta, () => (this.isFiring = true));
    // this.position.y += (this.speed * delta) / 1000;
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

function arrowFormation(center, height, cellSize) {
  let coords = [];
  coords.push(center);
  for (let count = 1; count <= height * 2 - 1; count++) {
    if (count % 2 == 0) {
      let coordY = center.y - cellSize.y * count;
      let coordA = new Vec(center.x - cellSize.x * count, coordY);
      let coordB = new Vec(center.x + cellSize.x * count, coordY);
      coords.push(coordA, coordB);
    }
  }
  return coords;
}

function diamondFormation(center, height, cellSize) {
  let coords = [];
  coords.push(center);
  console.log(center);
  for (let count = 0; count <= height; count++) {
    let distance = height - count;
    let bodyX = cellSize.x / 2;
    let bodyY = cellSize.y / 2;

    let leftX = center.x - cellSize.x * distance;
    let leftY = center.y - count * cellSize.y;

    console.log(leftX);

    // let rightX = center.x + bodyX - cellSize.x * distance;
    // let topY = center.y - bodyY - cellSize.y * distance;
    // let bottomY = center.y + bodyY - cellSize.y * distance;

    let coordA = new Vec(leftX, leftY);
    // let coordB = new Vec(
    //   center.x - cellSize.x - count * cellSize.x,
    //   center.y - cellSize.y / 2 - (height - count) * cellSize.y
    // );
    // let coordC = new Vec(
    //   center.x + cellSize.x + count * cellSize.x,
    //   center.y + cellSize.y / 2 + (height - count) * cellSize.y
    // );
    // let coordD = new Vec(
    //   center.x - cellSize.x - count * cellSize.x,
    //   center.y + cellSize.y / 2 + (height - count) * cellSize.y
    // );
    coords.push(coordA);
  }
  console.log(coords);
  return coords;
}

function createDistinctEnemies(display) {
  let coords = [];
  let displaySize = display.size;
  let cellSize = display.cellSize;
  let center = new Vec(displaySize.x / 2, 400);
  let radius = 4;

  let circularCoords = diamondFormation(center, radius, cellSize);
  coords.push(...circularCoords);

  return coords.map((coord) => new Enemy(cellSize, coord, 200));
}

class State {
  constructor(config) {
    this.actors = [];
    this.config = config;
    this.spawnInterval = createInterval(1000);
    this.spawnCount = 1;
  }
  update(delta) {
    if (this.actors.length == 0) {
      let enemies = createDistinctEnemies(this.config.display);
      this.actors.push(...enemies);
    }

    this.spawnInterval(delta, () => {
      // let enemies = createEnemies(this.spawnCount, this.config.enemySize);
      // let enemies = createDistinctEnemies(this.config.display);
      // this.actors.push(...enemies);
    });

    let bullets = [];
    this.actors.map((enemy) => {
      if (enemy.isFiring && enemy.position.y > 0) {
        let bulletPos = new Vec(
          enemy.position.x,
          enemy.position.y + this.config.enemySize.y / 2
        );
        bullets.push(new Bullet(this.config.bulletSize, bulletPos, 500, 10));
      }
    });
    this.actors.push(...bullets);

    this.actors = this.actors.filter(
      (actor) => actor.position.y <= this.config.display.size.y
    );
    this.actors.forEach((actor) => {
      actor.update(delta);
    });
  }
}

function runGame() {
  const displayParent = document.getElementById("wrapper");

  let state = new State({
    enemySize: new Vec(32, 32),
    bulletSize: new Vec(4, 4),
    display: {
      scale: 0.8,
      cellSize: new Vec(32, 32),
      gridSize: new Vec(16, 32),
      get size() {
        return this.gridSize.multiply(this.cellSize.multiplyScalar(this.scale));
      },
    },
  });

  let display = new Display(state.config.display, displayParent);

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
