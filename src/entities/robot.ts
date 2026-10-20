import { GameObject } from "../engine/GameObject";
import { wallCollision } from "../physics/coliders";
import mecanumKinematics from "../physics/mecanum";
import drawRobot from "../render/drawRobot";
import type { WheelPowers } from "../types";
import { updateMecanum } from "../utils/drivetrain";
import { robotCentricDrive } from "../utils/mecanumDrive";

export class Robot extends GameObject {
  wheelPowers: WheelPowers = {
    leftFront: 0,
    rightFront: 0,
    leftBack: 0,
    rightBack: 0,
  };

  drive(forward: number, strafe: number, rotate: number) {
    this.wheelPowers = robotCentricDrive(forward, strafe, rotate);
  }

  update(_dt: number, centerX: number = 0, centerY: number = 0): void {
    const velocity = mecanumKinematics(this.wheelPowers, 350, 5);
    const rawMovement = updateMecanum(
      {
        x: this.transform.x,
        y: this.transform.y,
        heading: this.transform.rotation,
      },
      velocity,
      _dt,
    );

    const correctedPosition = wallCollision(
      rawMovement.x,
      rawMovement.y,
      rawMovement.heading,
      centerX,
      centerY,
    );

    this.transform.x = correctedPosition.x;
    this.transform.y = correctedPosition.y;
    this.transform.rotation = rawMovement.heading;
  }
  render(ctx: CanvasRenderingContext2D): void {
    drawRobot(ctx, this.transform);
  }
}
