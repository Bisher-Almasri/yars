import { Transform } from "../engine/Transform";

function drawRobot(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  target: Transform,
  color?: string,
) {
  const robotSize = 18 * 6;
  const wheelOffset = robotSize / 2 - 2;
  const wheelWidth = 3 * 6;
  const wheelHeight = 6 * 6;

  ctx.save();
  ctx.translate(transform.x, transform.y);
  ctx.rotate(transform.rotation);

  ctx.strokeStyle = "#9ca6b1";
  ctx.fillStyle = "#25282e";
  ctx.lineWidth = 4;

  const topLeftCorner = -robotSize / 2;
  const bottomLeftCorner = -robotSize / 2;
  const topRightCorner = robotSize;
  const bottomRightCorner = robotSize;

  ctx.beginPath();
  ctx.rect(topLeftCorner, bottomLeftCorner, topRightCorner, bottomRightCorner);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = "#62717c";

  ctx.strokeRect(-wheelOffset, topLeftCorner + 2, wheelWidth, wheelHeight);
  ctx.strokeRect(
    -wheelOffset,
    wheelOffset - wheelHeight,
    wheelWidth,
    wheelHeight,
  );
  ctx.strokeRect(
    wheelOffset - wheelWidth,
    topLeftCorner + 2,
    wheelWidth,
    wheelHeight,
  );
  ctx.strokeRect(
    wheelOffset - wheelWidth,
    wheelOffset - wheelHeight,
    wheelWidth,
    wheelHeight,
  );

  //todo: get field pos scof thibng
  const turretLocalX = 0;
  const turretLocalY = -wheelHeight + 56;

  const cos = Math.cos(transform.rotation);
  const sin = Math.sin(transform.rotation);

  const turretGlobalX = transform.x + (turretLocalX * cos - turretLocalY * sin);
  const turretGlobalY = transform.y + (turretLocalX * sin + turretLocalY * cos);

  const globalTurretRotation = Math.atan2(
    target.y - turretGlobalY,
    target.x - turretGlobalX,
  );
  const localTurretRotation =
    globalTurretRotation - transform.rotation + Math.PI / 2;

  if (color)
    drawShooter(
      ctx,
      new Transform(turretLocalX, turretLocalY, 0, localTurretRotation),
      color,
    );
  else
    drawShooter(
      ctx,
      new Transform(turretLocalX, turretLocalY, 0, localTurretRotation),
    );

  const intakeDepth = 14;
  const intakeInset = 6;
  const intakeY = robotSize / 2 + intakeInset + intakeDepth / 2 - 6;

  drawIntake(ctx, new Transform(0, -intakeY));

  ctx.restore();
}

function drawIntake(ctx: CanvasRenderingContext2D, pos: Transform) {
  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(pos.rotation);

  ctx.strokeStyle = "#d28b32";
  ctx.fillStyle = "#6b4a28";
  ctx.lineWidth = 3;

  const centerWheelRadius = 3;
  for (const wheelX of [-15, -5, 5]) {
    ctx.beginPath();
    ctx.strokeStyle = "#d28b32";
    ctx.fillStyle = "#c4ccd4";
    ctx.roundRect(wheelX, 0, 10, 15, centerWheelRadius);
    ctx.fill();
    ctx.stroke();
  }

  for (const wheelX of [-45, -35, -25, 15, 25, 35]) {
    ctx.strokeStyle = "#9cb6a1";
    ctx.fillStyle = "#59636e";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(wheelX, 0, 10, 15, centerWheelRadius);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawShooter(
  ctx: CanvasRenderingContext2D,
  pos: Transform,
  color?: string,
) {
  const barrelWidth = 15;
  const barrelHeight = 28;
  const turretRadius = 22;

  ctx.save();

  ctx.translate(pos.x, pos.y);
  ctx.rotate(pos.rotation);

  ctx.strokeStyle = color || "#7b8392";
  ctx.fillStyle = "#3e4758";
  ctx.lineWidth = 12;

  ctx.beginPath();
  ctx.arc(0, 0, turretRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();

  ctx.fillStyle = "#636363";

  ctx.fillRect(-barrelWidth / 2, -barrelHeight, barrelWidth, barrelHeight);

  ctx.restore();
}

export default drawRobot;
