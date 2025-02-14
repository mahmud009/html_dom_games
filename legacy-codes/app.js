function runGame(state) {
  const displayParent = document.getElementById("wrapper");
  const displayConfig = state.config.display;

  let display = new Display(displayConfig, displayParent);

  let lastTime = performance.now();
  function loop(time) {
    let delta = time - lastTime;
    lastTime = time;
    if (!state.isPaused) {
      state.update(delta);
      display.sync(() => draw(state.actors));
    }
    requestAnimationFrame(loop);
  }

  loop(lastTime);
}

let gameState = new State({
  bulletSize: new Vec(12, 12),
  enemySize: new Vec(12, 12),
  display: {
    scale: 1,
    cellSize: new Vec(16, 16),
    gridSize: new Vec(16, 32),
    get size() {
      return this.gridSize.multiply(this.cellSize.multiplyScalar(this.scale));
    },
  },
});

runGame(gameState);

setTimeout(() => {
  // gameState.isPaused = true;
}, 1000);
