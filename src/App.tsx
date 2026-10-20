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

    const handleKeyDown = (event: KeyboardEvent) => {
      game.keyDown(event.key);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      game.keyUp(event.key);
    };

    const handleBlur = () => {
      for (const key of [
        "w", "a", "s", "d", "q", "e",
        "arrowup", "arrowdown",
        "arrowleft", "arrowright",
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
    />
  );
}

export default App;