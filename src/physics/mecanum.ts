import type { Velocity, WheelPowers } from "../types";

export default function mecanumKinematics(
  wheels: WheelPowers,
  maxSpeed: number,
  maxTurnSpeed: number,
): Velocity {
  const { leftFront: lf, rightFront: rf, leftBack: lb, rightBack: rb } = wheels;

  return {
    forward: ((lf + rf + lb + rb) / 4) * maxSpeed,
    strafe: ((lf - rf - lb + rb) / 4) * maxSpeed,
    rotate: ((-lf - rf + lb + rb) / 4) * maxTurnSpeed,
  };
}
