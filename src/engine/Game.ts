// import { Field } from "../entities/field";
import { biobuzzField } from "../entities/fields/biobuzz";
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
      new biobuzzField(
        new Transform(this.centerX, this.centerY, 0),
        this.world.physicsWorld,
      ),
    );

    this.world.add(
      new Robot(
        new Transform(this.centerX, this.centerY - 360, 1),
        this.world.physicsWorld,
      ),
    );
  }

  start() {
    this.lastTime = 0;
    this.animationId = requestAnimationFrame(this.loop);
  }

  stop() {
    cancelAnimationFrame(this.animationId);
  }

  keyUp(key: string) {
    this.keys.delete(key.toLowerCase());
  }

  keyDown(key: string) {
    this.keys.add(key.toLowerCase());
  }

  private loop = (timestap: number) => {
    const dt =
      this.lastTime == 0
        ? 0
        : Math.min((timestap - this.lastTime) / 1000, 0.05);
    this.lastTime = timestap;

    const pressed = this.keys;

    let forward =
      Number(pressed.has("w") || pressed.has("arrowup")) -
      Number(pressed.has("s") || pressed.has("arrowdown"));

    let strafe =
      Number(pressed.has("d") || pressed.has("arrowright")) -
      Number(pressed.has("a") || pressed.has("arrowleft"));

    let turn = Number(pressed.has("e")) - Number(pressed.has("q"));

    let isShooting = pressed.has("space");

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let gamepad: Gamepad | null = null;

    for (let i = 0; i < gamepads.length; i++) {
      const gP = gamepads[i];
      if (gP !== null) {
        gamepad = gP;
        break;
      }
    }

    // console.log(gamepads);

    if (gamepad) {
      const inputs = this.handleGamepad(gamepad);

      if (inputs.forward != 0) forward = Math.min(forward + inputs.forward, 1);
      if (inputs.strafe != 0) strafe = Math.min(strafe + inputs.strafe, 1);
      if (inputs.turn != 0) turn = Math.min(turn + inputs.turn, 1);
      if (inputs.shoot && !isShooting) isShooting = true;
    }

    const robot = [...this.world.getAll()].find(
      (object): object is Robot => object instanceof Robot,
    );

    if (dt > 0) {
      this.world.update(dt, this.world.eventQueue);
    }

    if (robot) {
      robot.drive(forward, strafe, turn);
      if (isShooting) {
        robot.shoot(this.world);
      }
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.world.render(this.ctx);

    this.animationId = requestAnimationFrame(this.loop);
  };

  private handleGamepad(gamePad: Gamepad): {
    forward: number;
    strafe: number;
    turn: number;
    shoot: boolean;
  } {
    const DEADZONE = 0;

    let strafeAxis = gamePad.axes[0] || 0;
    let forwardAxis = gamePad.axes[1] || 0;
    let turnAxis = gamePad.axes[2] || 0;

    strafeAxis = Math.abs(strafeAxis) > DEADZONE ? strafeAxis : 0;
    forwardAxis = Math.abs(forwardAxis) > DEADZONE ? forwardAxis : 0;
    turnAxis = Math.abs(turnAxis) > DEADZONE ? turnAxis : 0;

    const rightTrigger = gamePad.buttons[7];
    const shoot = rightTrigger
      ? rightTrigger.value > 0.5 || rightTrigger.pressed
      : false;

    return {
      forward: -forwardAxis,
      strafe: strafeAxis,
      turn: turnAxis,
      shoot: shoot,
    };
  }
}
