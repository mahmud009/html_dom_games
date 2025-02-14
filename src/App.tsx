import React from "react";
import { GameState } from "./system/GameState";
import { CanvasDisplay, Display } from "./system/Display";
import { drawActors, drawCanvasActors } from "./utils/draw-actors";
import { Button, Stack } from "@mui/material";

const gameState = new GameState();

function runGame() {
  const displayParent = document.getElementById("wrapper");
  const display = new CanvasDisplay(displayParent);

  let lastTime = performance.now();
  function loop(time) {
    const delta = time - lastTime;
    lastTime = time;
    if (gameState.isPlaying) {
      gameState.update(delta);
      // display.sync(() => drawActors(gameState.actors));
      display.sync(() => drawCanvasActors(display.canvasCtx, gameState.actors));
    }
    requestAnimationFrame(loop);
  }

  loop(lastTime);
}

function App() {
  const [isGameRendered, setIsGameRendered] = React.useState(false);

  React.useEffect(() => {
    if (!isGameRendered) {
      runGame();
      setIsGameRendered(true);
    }
  }, []);

  return (
    <Stack p={4} spacing={2} alignItems={"center"}>
      <div id="wrapper"></div>

      <Stack direction={"row"} spacing={2}>
        <Button variant="contained" onClick={() => gameState.start()}>
          Start
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            gameState.pause();
          }}
        >
          Pause
        </Button>
      </Stack>
    </Stack>
  );
}

export default App;
