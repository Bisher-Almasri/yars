import type { Transform } from "../engine/Transform";
import type { gamePiece } from "../types";

export function drawgamePiece(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  GamePiece: gamePiece,
) {
  ctx.save()

  if (transform.y - transform.z > 0) {
    ctx.translate(transform.x, transform.y)
    const factor = 100
    ctx.scale(Math.max(1, transform.z/factor), Math.max(1, transform.z/factor))
    ctx.translate(-transform.x, -transform.y)
  }

  ctx.beginPath();
  ctx.fillStyle = GamePiece.color;
  ctx.arc(transform.x, transform.y, GamePiece.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore()
}
