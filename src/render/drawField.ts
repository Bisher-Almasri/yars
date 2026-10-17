function drawField(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
) {
  // field size is 144x144 inches (6x6 tiles)
  const FIELD_SIZE = 144;
  const SCALE = 6;
  const FIELD_PIXELS = FIELD_SIZE * SCALE;
  const TILE_SIZE = FIELD_PIXELS / 6;
  // mat
  ctx.fillStyle = "#23262b";
  ctx.fillRect(
    (canvas.width - FIELD_PIXELS) / 2,
    (canvas.height - FIELD_PIXELS) / 2,
    FIELD_PIXELS,
    FIELD_PIXELS,
  );

  // tile
  ctx.strokeStyle = "#2c3038";
  ctx.lineWidth = 1;

  for (let i = 1; i <= 6; i++) {
    const offset = -FIELD_PIXELS / 2 + i * TILE_SIZE;
    ctx.beginPath();
    ctx.moveTo(centerX + offset, centerY - FIELD_PIXELS / 2);
    ctx.lineTo(centerX + offset, centerY + FIELD_PIXELS / 2);
    ctx.moveTo(centerX - FIELD_PIXELS / 2, centerY + offset);
    ctx.lineTo(centerX + FIELD_PIXELS / 2, centerY + offset);
    ctx.stroke();
  }

  // wall
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;

  ctx.strokeRect(
    centerX - FIELD_PIXELS / 2,
    centerY - FIELD_PIXELS / 2,
    FIELD_PIXELS,
    FIELD_PIXELS,
  );
}

export default drawField;
