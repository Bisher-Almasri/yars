import { useEffect, useRef } from "react";
import { Game } from "./engine/Game";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new Game(ctx, canvas);
    game.start();

    canvas.tabIndex = 0;
    canvas.focus();

    const getGameKey = (event: KeyboardEvent) => {
      if (event.code === "Space") return "space";
      return event.key.toLowerCase();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          event.code,
        )
      ) {
        event.preventDefault();
      }
      game.keyDown(getGameKey(event));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(
          event.code,
        )
      ) {
        event.preventDefault();
      }
      game.keyUp(getGameKey(event));
    };

    const handleBlur = () => {
      for (const key of [
        "w",
        "a",
        "s",
        "d",
        "q",
        "e",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
        "space",
      ]) {
        game.keyUp(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      game.stop();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="field"
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
      }}
      onClick={() => canvasRef.current?.focus()}
      tabIndex={0}
    />
  );
}

export default App;
