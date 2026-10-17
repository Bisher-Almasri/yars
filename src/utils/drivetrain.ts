import type { Velocity } from "../types";

export function updateMecanum(
  robot: { x: number; y: number; heading: number },
  velocity: Velocity,
  dt: number,
) {
  const { forward, strafe, rotate } = velocity;

  const heading = robot.heading;

  const fieldVx = forward * Math.sin(heading) + strafe * Math.cos(heading);

  const fieldVy = -forward * Math.cos(heading) + strafe * Math.sin(heading);

  return {
    x: robot.x + fieldVx * dt,
    y: robot.y + fieldVy * dt,
    heading: heading + rotate * dt,
  };
}
