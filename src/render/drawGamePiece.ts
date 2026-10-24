import type { Transform } from "../engine/Transform";
import type { GamePiece } from "../types";

export function drawGamePiece(
  ctx: CanvasRenderingContext2D,
  transform: Transform,
  gamePiece: GamePiece,
) {
  ctx.save()

  if (transform.y - transform.z > 0) {
    ctx.translate(transform.x, transform.y)
    ctx.scale(Math.max(1, transform.z), Math.max(1, transform.z))
    ctx.translate(-transform.x, -transform.y)
  }

  ctx.beginPath();
  ctx.fillStyle = gamePiece.color;
  ctx.arc(transform.x, transform.y, gamePiece.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore()
}
