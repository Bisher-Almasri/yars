import type { WheelPowers } from "../types";

export function robotCentricDrive(
  forward: number,
  strafe: number,
  turn: number,
): WheelPowers {
  let leftFront = forward + strafe - turn;
  let rightFront = forward - strafe - turn;
  let leftBack = forward - strafe + turn;
  let rightBack = forward + strafe + turn;

  const max = Math.max(
    1,
    Math.abs(leftFront),
    Math.abs(rightFront),
    Math.abs(leftBack),
    Math.abs(rightBack),
  );

  leftFront /= max;
  rightFront /= max;
  leftBack /= max;
  rightBack /= max;

  return { leftFront, rightFront, leftBack, rightBack };
}

export function fieldCentricDrive(
  forward: number,
  strafe: number,
  turn: number,
  robotHeading: number,
): WheelPowers {
  const cos = Math.cos(robotHeading);
  const sin = Math.sin(robotHeading);

  const fieldCentricForward = forward * cos + strafe * sin;
  const fieldCentricStrafe = strafe * cos - forward * sin;

  let leftFront = fieldCentricForward + fieldCentricStrafe - turn;
  let rightFront = fieldCentricForward - fieldCentricStrafe - turn;
  let leftBack = fieldCentricForward - fieldCentricStrafe + turn;
  let rightBack = fieldCentricForward + fieldCentricStrafe + turn;

  const max = Math.max(
    1,
    Math.abs(leftFront),
    Math.abs(rightFront),
    Math.abs(leftBack),
    Math.abs(rightBack),
  );

  leftFront /= max;
  rightFront /= max;
  leftBack /= max;
  rightBack /= max;

  return { leftFront, rightFront, leftBack, rightBack };
}
