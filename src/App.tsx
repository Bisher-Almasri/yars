import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import drawField from "./render/drawField";
import drawRobot from "./render/drawRobot";
import { robotCentricDrive } from "./utils/mecanumDrive";
import { updateMecanum } from "./utils/drivetrain";
import mecanumKinematics from "./physics/mecanum";
import { wallCollision } from "./physics/coliders";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keys = useRef(new Set<string>());

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    centerX: window.innerWidth / 2,
    centerY: window.innerHeight / 2,
  });

  const [pos, setPos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    heading: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("no canvas");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("no ctx");
      return;
    }

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawField(canvas, ctx, dimensions.centerX, dimensions.centerY);
    drawRobot(ctx, pos.x, pos.y, pos.heading);
  }, [pos, dimensions]);

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        centerX: window.innerWidth / 2,
        centerY: window.innerHeight / 2,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    let animationId = 0;
    let lastTime = 0;

    function loop(timestap: number) {
      const dt =
        lastTime == 0 ? 0 : Math.min((timestap - lastTime) / 1000, 0.05);
      lastTime = timestap;

      const pressed = keys.current;

      const forward =
        Number(pressed.has("w") || pressed.has("arrowup")) -
        Number(pressed.has("s") || pressed.has("arrowdown"));

      const strafe =
        Number(pressed.has("d") || pressed.has("arrowright")) -
        Number(pressed.has("a") || pressed.has("arrowleft"));

      const turn = Number(pressed.has("e")) - Number(pressed.has("q"));

      const wheelPower = robotCentricDrive(forward, strafe, turn);
      const velocity = mecanumKinematics(wheelPower, 350, 5);

      setPos((prev) => {
        const rawMovement = updateMecanum(prev, velocity, dt);

        const correctedPosition = wallCollision(
          rawMovement.x,
          rawMovement.y,
          rawMovement.heading,
          dimensions.centerX,
          dimensions.centerY,
        );

        return {
          x: correctedPosition.x,
          y: correctedPosition.y,
          heading: rawMovement.heading,
        };
      });

      animationId = requestAnimationFrame(loop);
    }

    animationId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationId);
  }, [dimensions]);

  function handleKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault();
    }

    keys.current.add(event.key.toLowerCase());
  }

  function handleKeyUp(event: KeyboardEvent<HTMLCanvasElement>) {
    keys.current.delete(event.key.toLowerCase());
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <canvas
        ref={canvasRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={() => keys.current.clear()}
        id="field"
      />
    </div>
  );
}

export default App;
