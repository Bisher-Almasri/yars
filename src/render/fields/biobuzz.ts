import type { GameObject } from "../../engine/GameObject";
import { Transform } from "../../engine/Transform";
import { GamePiece } from "../../entities/gamepiece";
import type { gamePiece } from "../../types";

const FIELD_SIZE = 144;
const SCALE = 6;
const FIELD_PIXELS = FIELD_SIZE * SCALE;
const TILE_SIZE = FIELD_PIXELS / 6;

const redGP: gamePiece = { color: "#ED1C25", radius: 1.8 * 6 };
const blueGP: gamePiece = { color: "#0066B3", radius: 1.8 * 6 };

export function drawBiobuzzField(
  ctx: CanvasRenderingContext2D,
  center: Transform,
  gameObject?: GameObject,
) {
  ctx.save();
  ctx.translate(center.x, center.y);
  // field size is 144x144 inches (6x6 tiles)
  // inspiration: https://github.com/Pedro-Pathing/Visualizer/blob/main/public/fields/biobuzz.webp

  // nectar drop zones

  drawHumanPlayer(ctx, getCenterTile(0, 1), "#E1171E", 1);
  drawHumanPlayer(ctx, getCenterTile(5, 4), "#2F2989", -1);

  drawStripeMark(ctx, getCenterTile(0, 5), "#E1171E", 1, center, gameObject);
  drawStripeMark(ctx, getCenterTile(5, 0), "#2F2989", -1, center, gameObject);

  ctx.restore();
}

function getCenterTile(col: number, row: number): Transform {
  // since we start in 0,0 (center of field (not on any tile))
  return new Transform(
    (col - 3 + 0.5) * TILE_SIZE,
    (row - 3 + 0.5) * TILE_SIZE,
  );
}

function drawHumanPlayer(
  ctx: CanvasRenderingContext2D,
  center: Transform,
  color: string,
  direction: 1 | -1,
) {
  ctx.strokeStyle = color;

  ctx.strokeRect(
    center.x + (direction === 1 ? 0 : -4),
    center.y - TILE_SIZE / 2 + 1,
    4,
    TILE_SIZE - 3,
  );

  ctx.strokeRect(
    center.x - direction * (TILE_SIZE / 2 - 4),
    center.y - TILE_SIZE / 2,
    direction * (TILE_SIZE / 2),
    4,
  );

  ctx.strokeRect(
    center.x - direction * (TILE_SIZE / 2 - 4),
    center.y + TILE_SIZE / 2 - 4,
    direction * (TILE_SIZE / 2),
    4,
  );
}

function drawStripeMark(
  ctx: CanvasRenderingContext2D,
  tileCenter: Transform,
  color: string,
  direction: 1 | -1,
  fieldCenter: Transform,
  gameObject?: GameObject,
) {
  ctx.strokeStyle = color;

  ctx.strokeRect(
    tileCenter.x - direction * (TILE_SIZE / 2 - 4),
    tileCenter.y + direction * (TILE_SIZE / 2 - (direction == 1 ? 8 : 4)),
    direction * (TILE_SIZE - 7),
    4,
  );

  if (gameObject) {
    const x = fieldCenter.x - direction * (TILE_SIZE / 2 - 4) + tileCenter.x;
    const y =
      fieldCenter.y +
      direction * (TILE_SIZE / 2 - (direction == 1 ? 8 : 4)) +
      tileCenter.y;

    const offset = 16.8; //2.8x6
    for (let i = 0; i < 4; i++) {
      let gamePiece = new GamePiece(
        new Transform(
          x + offset * direction * i + (offset / 2) * direction,
          y - (offset / 2) * direction + -(direction == 1 ? -6 : 2),
        ),
        gameObject.physicsWorld,
      );
      gameObject.addChild(gamePiece);
    }
  }
}

function drawFlower() {} // todo: Add flower
function drawHives() {} // todo: Add Hives