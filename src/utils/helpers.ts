import { Transform } from "../engine/Transform";

const FIELD_SIZE = 144;
const SCALE = 6;
const FIELD_PIXELS = FIELD_SIZE * SCALE;
const TILE_SIZE = FIELD_PIXELS / 6;

export function getCenterTile(col: number, row: number): Transform {
  // since we start in 0,0 (center of field (not on any tile))
  return new Transform(
    (col - 3 + 0.5) * TILE_SIZE,
    (row - 3 + 0.5) * TILE_SIZE,
  );
}

export function getCenterTileWorld(
  col: number,
  row: number,
  fieldCenter: Transform,
): Transform {
  const local = getCenterTile(col, row);

  return new Transform(fieldCenter.x + local.x, fieldCenter.y + local.y);
}
