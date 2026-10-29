import type { Transform } from "../engine/Transform";

function drawField(ctx: CanvasRenderingContext2D, center: Transform) {
  // field size is 144x144 inches (6x6 tiles)
  const FIELD_SIZE = 144;
  const SCALE = 6;
  const FIELD_PIXELS = FIELD_SIZE * SCALE;
  const TILE_SIZE = FIELD_PIXELS / 6;
  // mat
  ctx.fillStyle = "#25282e";
  ctx.fillRect(
    center.x - FIELD_PIXELS / 2,
    center.y - FIELD_PIXELS / 2,
    FIELD_PIXELS,
    FIELD_PIXELS,
  );

  // tile
  ctx.strokeStyle = "#2e323b";
  ctx.lineWidth = 1;

  for (let i = 1; i <= 6; i++) {
    const offset = -FIELD_PIXELS / 2 + i * TILE_SIZE;
    ctx.beginPath();
    ctx.moveTo(center.x + offset, center.y - FIELD_PIXELS / 2);
    ctx.lineTo(center.x + offset, center.y + FIELD_PIXELS / 2);
    ctx.moveTo(center.x - FIELD_PIXELS / 2, center.y + offset);
    ctx.lineTo(center.x + FIELD_PIXELS / 2, center.y + offset);
    ctx.stroke();
  }

  // wall
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;

  ctx.strokeRect(
    center.x - FIELD_PIXELS / 2,
    center.y - FIELD_PIXELS / 2,
    FIELD_PIXELS,
    FIELD_PIXELS,
  );
}

export default drawField;
