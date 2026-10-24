// import { Field } from "../entities/field";
import { biobuzzField } from "../entities/fields/biobuzz";
import { GamePiece } from "../entities/gamepiece";
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
      new biobuzzField(new Transform(this.centerX, this.centerY, 0))
    )

    this.world.addGroup(
      new GamePiece(new Transform(this.centerX+250, this.centerY+250, 0)),
      new GamePiece(new Transform(this.centerX+190, this.centerY+250, 0)),
      new GamePiece(new Transform(this.centerX+130, this.centerY+250, 0)),
      new GamePiece(new Transform(this.centerX+70, this.centerY+250, 0)),
      new GamePiece(new Transform(this.centerX+10, this.centerY+250, 0)),
      new GamePiece(new Transform(this.centerX-50, this.centerY+250, 0)),
    )

    const pollen1 = new GamePiece(new Transform(this.centerX+250, this.centerY-250, 0), {color: "#ED1C25", radius: 1.8*6})
    pollen1.type = "Red Nectar"
    const pollen2 = new GamePiece(new Transform(this.centerX+190, this.centerY-250, 0), {color: "#ED1C25", radius: 1.8*6})
    pollen2.type = "Red Nectar"
    const pollen3 = new GamePiece(new Transform(this.centerX+130, this.centerY-250, 0), {color: "#ED1C25", radius: 1.8*6})
    pollen3.type = "Red Nectar"
    this.world.addGroup(pollen1, pollen2, pollen3)

    const pollen4 = new GamePiece(new Transform(this.centerX+70, this.centerY-250, 0), {color: "#0066B3", radius: 1.8*6})
    pollen4.type = "Blue Nectar"
    const pollen5 = new GamePiece(new Transform(this.centerX+10, this.centerY-250, 0), {color: "#0066B3", radius: 1.8*6})
    pollen5.type = "Blue Nectar"
    const pollen6 = new GamePiece(new Transform(this.centerX-50, this.centerY-250, 0), {color: "#0066B3", radius: 1.8*6})
    pollen6.type = "Blue Nectar"
    this.world.addGroup(pollen4, pollen5, pollen6)

    this.world.add(
      new Robot(new Transform(this.centerX-250, this.centerY, 0)),
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
        if (pressed.has("space")) {
          robot.shoot(this.world)
        }
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    this.ctx.fillStyle = "#000"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.world.render(this.ctx)

    this.animationId = requestAnimationFrame(this.loop);
  }
}
