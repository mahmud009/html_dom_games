import React from "react";
import { State } from "./system/State";
import { Vec } from "./system/Vec";
import { Display } from "./system/Display";
import { drawActors } from "./utils/draw-actors";

const gameState = new State({
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

function runGame(state) {
  const displayParent = document.getElementById("wrapper");
  const displayConfig = state.config.display;

  const display = new Display(displayConfig, displayParent);

  let lastTime = performance.now();
  function loop(time) {
    const delta = time - lastTime;
    lastTime = time;
    if (!state.isPaused) {
      state.update(delta);
      display.sync(() => drawActors(state.actors));
    }
    requestAnimationFrame(loop);
  }

  loop(lastTime);
}

function App() {
  React.useEffect(() => {
    // console.log(createDomElement);
    runGame(gameState);
  }, []);

  return <div id="wrapper"></div>;
}

export default App;
