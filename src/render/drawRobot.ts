function drawRobot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  heading: number,
) {
  const robotSize = 18 * 6;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);

  ctx.strokeStyle = "#9AA3AD";
  ctx.lineWidth = 4;
  ctx.strokeRect(-robotSize / 2, -robotSize / 2, robotSize, robotSize);
  ctx.restore();
}

export default drawRobot;
