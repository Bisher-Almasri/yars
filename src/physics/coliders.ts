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

export function robotBallCollision(
  robotX: number,
  robotY: number,
  robotHeading: number,
  ballX: number,
  ballY: number,
  ballRadius: number,
): {collided: boolean, x: number, y: number} {
  const SCALE = 6;
  const ROBOT_SIZE = 18 * SCALE;
  const halfRobot = ROBOT_SIZE / 2;

  const Dx = ballX - robotX;
  const Dy = ballY - robotY;

  const cos = Math.cos(-robotHeading);
  const sin = Math.sin(-robotHeading);

  const localBallX = Dx * cos - Dy * sin;
  const localBallY = Dx * sin + Dy * cos;

  const closestX = Math.max(-halfRobot, Math.min(halfRobot, localBallX));
  const closestY = Math.max(-halfRobot, Math.min(halfRobot, localBallY));

  const distX = localBallX - closestX;
  const distY = localBallY - closestY;
  const distance = Math.sqrt(distX * distX + distY * distY)

if (distance < ballRadius) {
  let pushLocalX = 0;
  let pushLocalY = 0;

  if (distance === 0) {
    const distanceToLeft = localBallX + halfRobot;
    const distanceToRight = halfRobot - localBallX;
    const distanceToTop = localBallY + halfRobot;
    const distanceToBottom = halfRobot - localBallY;

    const shortestDistance = Math.min(
      distanceToLeft,
      distanceToRight,
      distanceToTop,
      distanceToBottom,
    );

    if (shortestDistance === distanceToLeft) {
      pushLocalX = -(distanceToLeft + ballRadius);
    } else if (shortestDistance === distanceToRight) {
      pushLocalX = distanceToRight + ballRadius;
    } else if (shortestDistance === distanceToTop) {
      pushLocalY = -(distanceToTop + ballRadius);
    } else {
      pushLocalY = distanceToBottom + ballRadius;
    }
  } else {
    const overlap = ballRadius - distance;

    pushLocalX = (distX / distance) * overlap;
    pushLocalY = (distY / distance) * overlap;
  }

    const revCos = Math.cos(robotHeading);
    const revSin = Math.sin(robotHeading);

    const pushGlobalX = pushLocalX * revCos - pushLocalY * revSin;
    const pushGlobalY = pushLocalX * revSin + pushLocalY * revCos;

    return {
      collided: true,
      x: ballX + pushGlobalX,
      y: ballY + pushGlobalY
    }
  }

  return {
    collided: false,
    x: ballX,
    y: ballY
  }
}

export function ballWallCollision(
  ballX: number,
  ballY: number,
  ballRadius: number,
  centerX: number,
  centerY: number,
):  {collided: boolean, x: number, y: number} {
  const FIELD_SIZE = 144
  const fieldPixels = FIELD_SIZE * 6;
  const fieldHalf = fieldPixels / 2;

  const minX = centerX - fieldHalf + ballRadius;
  const maxX = centerX + fieldHalf - ballRadius;
  const minY = centerY - fieldHalf + ballRadius;
  const maxY = centerY + fieldHalf - ballRadius;

  const correctedX = Math.max(minX, Math.min(maxX, ballX));
  const correctedY = Math.max(minY, Math.min(maxY, ballY));

  return {
    collided: ballX != correctedX || correctedY != ballY,
    x: correctedX,
    y: correctedY
  }
}