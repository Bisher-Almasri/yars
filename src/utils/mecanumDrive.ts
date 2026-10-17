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
