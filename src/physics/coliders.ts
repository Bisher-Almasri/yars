export function wallCollision(
  robotX: number,
  robotY: number,
  robotHeading: number,
  centerX: number,
  centerY: number,
): { x: number; y: number } {
  const FIELD_SIZE = 144;
  const SCALE = 6;
  const FIELD_PIXELS = FIELD_SIZE * SCALE;
  const ROBOT_SIZE = 18 * 6;

  const halfField = FIELD_PIXELS / 2;
  const halfRobot = ROBOT_SIZE / 2;

  const minWallX = centerX - halfField;
  const minWallY = centerY - halfField;
  const maxWallX = centerX + halfField;
  const maxWallY = centerY + halfField;

  const cos = Math.cos(robotHeading);
  const sin = Math.sin(robotHeading);
  const localCorners = [
    { x: -halfRobot, y: -halfRobot }, //tl
    { x: halfRobot, y: -halfRobot }, //tr
    { x: halfRobot, y: halfRobot }, //br
    { x: -halfRobot, y: halfRobot }, //bl
  ];

  let maxOverMinX = 0;
  let maxOverMaxX = 0;
  let maxOverMinY = 0;
  let maxOverMaxY = 0;

  for (const corner of localCorners) {
    const rotatedX = corner.x * cos - corner.y * sin;
    const rotatedY = corner.x * sin + corner.y * cos;

    const globalCornerX = robotX + rotatedX;
    const globalCornerY = robotY + rotatedY;

    // what the skbidi
    if (globalCornerX < minWallX) {
      maxOverMinX = Math.max(maxOverMinX, minWallX - globalCornerX);
    }
    if (globalCornerX > maxWallX) {
      maxOverMaxX = Math.max(maxOverMaxX, globalCornerX - maxWallX);
    }
    if (globalCornerY < minWallY) {
      maxOverMinY = Math.max(maxOverMinY, minWallY - globalCornerY);
    }
    if (globalCornerY > maxWallY) {
      maxOverMaxY = Math.max(maxOverMaxY, globalCornerY - maxWallY);
    }
  }

  let correctedX = robotX;
  let correctedY = robotY;

  if (maxOverMinX > 0) correctedX += maxOverMinX;
  if (maxOverMaxX > 0) correctedX -= maxOverMaxX;
  if (maxOverMinY > 0) correctedY += maxOverMinY;
  if (maxOverMaxY > 0) correctedY -= maxOverMaxY;

  return { x: correctedX, y: correctedY };
}
