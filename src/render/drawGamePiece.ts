import type { GamePiece } from "../types";

export function drawGamePiece(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  gamePiece: GamePiece,
) {
  ctx.beginPath();
  ctx.fillStyle = gamePiece.color;
  ctx.arc(x, y, gamePiece.radius, 0, Math.PI * 2);
  ctx.fill();
}
