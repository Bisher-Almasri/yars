import { Field } from "../entities/field";
import { gamePiece } from "../entities/gamepiece";
import { Robot } from "../entities/robot";
import { Transform } from "./Transform";
import { World } from "./World";

export class Game {
  readonly world = new World();
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  private animationId = 0;
  private lastTime = 0;
  private keys = new Set<string>();

  private centerX: number;
  private centerY: number;

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;

    this.world.add(
      new Field(new Transform(this.centerX, this.centerY, 0))
    )

    this.world.add(
      new gamePiece(new Transform(this.centerX+250, this.centerY+250, 0))
    )

    this.world.add(
      new Robot(new Transform(this.centerX, this.centerY, 0)),
    );

  }

  start() {
    this.lastTime = 0
    this.animationId = requestAnimationFrame(this.loop)
  }

  stop() {
    cancelAnimationFrame(this.animationId)
  }

  keyUp(key: string) {
    this.keys.delete(key.toLowerCase())
  }

  keyDown(key: string) {
    this.keys.add(key.toLowerCase())
  }

  private loop = (timestap: number) => {
    const dt = this.lastTime == 0 ? 0 : Math.min((timestap - this.lastTime) / 1000, 0.05);
    this.lastTime = timestap;

    const pressed = this.keys;

    const forward =
      Number(pressed.has("w") || pressed.has("arrowup")) -
      Number(pressed.has("s") || pressed.has("arrowdown"));

    const strafe =
      Number(pressed.has("d") || pressed.has("arrowright")) -
      Number(pressed.has("a") || pressed.has("arrowleft"));

    const turn = Number(pressed.has("e")) - Number(pressed.has("q"));

    const robot = [...this.world.getAll()].find(
      (object): object is Robot => object instanceof Robot,
    );

    if (dt > 0 && this.world.eventQueue) {
        this.world.update(dt, this.world.eventQueue)
    }

    if (robot) {
        robot.drive(forward, strafe, turn);
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.ctx.fillStyle = "#000"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.world.render(this.ctx)

    this.animationId = requestAnimationFrame(this.loop);
  }
}
