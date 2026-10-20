import { Robot } from "../entities/robot";
import drawField from "../render/drawField";
import { Transform } from "./Transform";
import { World } from "./World";

export class Game {
  readonly world = new World();
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  private animationId = 0;
  private lastTime = 0;
  private keys = new Set<string>();

  constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.world.add(
      new Robot(new Transform(canvas.width / 2, canvas.height / 2, 0)),
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
    
    if (robot) {
        robot.drive(forward, strafe, turn);
        robot.update(dt, this.canvas.width / 2, this.canvas.height / 2);
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.ctx.fillStyle = "#000"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    drawField(this.canvas, this.ctx, this.canvas.width / 2, this.canvas.height / 2)
    this.world.render(this.ctx)

    this.animationId = requestAnimationFrame(this.loop);
  }
}
