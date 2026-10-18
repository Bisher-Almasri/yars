function drawRobot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  heading: number,
) {
  const robotSize = 18 * 6;
  const wheelOffset = robotSize/2 - 2;
  const wheelWidth = 4*6;
  const wheelHeight = 6*6  ;


  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);

  ctx.strokeStyle = "#9ca6b1";
  ctx.lineWidth = 4;
  
  const topLeftCorner = -robotSize / 2;
  const bottomLeftCorner = -robotSize / 2;
  const topRightCorner = robotSize;
  const bottomRightCorner = robotSize;

  ctx.strokeRect(topLeftCorner, bottomLeftCorner, topRightCorner, bottomRightCorner);

  ctx.fillStyle = "#333333"

  ctx.fillRect(-wheelOffset ,topLeftCorner+2, wheelWidth, wheelHeight)
  ctx.fillRect(-wheelOffset ,wheelOffset-wheelHeight, wheelWidth, wheelHeight)
  ctx.fillRect(wheelOffset-wheelWidth, topLeftCorner+2, wheelWidth, wheelHeight)
  ctx.fillRect(wheelOffset-wheelWidth, wheelOffset-wheelHeight, wheelWidth, wheelHeight)
  ctx.restore();
}

export default drawRobot;
