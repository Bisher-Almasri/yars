import RAPIER from "@dimforge/rapier2d-compat";
import type { GameObject } from "../../engine/GameObject";
import { Transform } from "../../engine/Transform";
import { GamePiece } from "../../entities/gamepiece";
import type { gamePiece } from "../../types";
import { getCenterTile } from "../../utils/helpers";
import {
  COLLISION_GROUP,
  registerHiveInterior,
  WORLD_COLLISION_GROUPS,
  collisionGroups,
} from "../../physics/collisionGroups";

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

  drawHumanPlayer(ctx, getCenterTile(0, 1), "#E1171E", 1, center, gameObject);
  drawHumanPlayer(ctx, getCenterTile(5, 4), "#2F2989", -1, center, gameObject);

  drawStripeMark(ctx, getCenterTile(0, 5), "#E1171E", 1, center, gameObject);
  drawStripeMark(ctx, getCenterTile(5, 0), "#2F2989", -1, center, gameObject);

  drawFlower(ctx, getCenterTile(2, 0), -1, center, gameObject);
  drawFlower(ctx, getCenterTile(4, 5), 1, center, gameObject);

  drawFlower(ctx, getCenterTile(5, 1), 1, center, gameObject, 1);
  drawFlower(ctx, getCenterTile(0, 3), 1, center, gameObject, -1);

  drawHives(ctx, center, gameObject);

  ctx.restore();
}

function drawHumanPlayer(
  ctx: CanvasRenderingContext2D,
  tileCenter: Transform,
  color: string,
  direction: 1 | -1,
  fieldCenter: Transform,
  gameObject?: GameObject,
) {
  ctx.strokeStyle = color;

  ctx.strokeRect(
    tileCenter.x + (direction === 1 ? 0 : -4),
    tileCenter.y - TILE_SIZE / 2 + 1,
    4,
    TILE_SIZE - 3,
  );

  ctx.strokeRect(
    tileCenter.x - direction * (TILE_SIZE / 2 - 4),
    tileCenter.y - TILE_SIZE / 2,
    direction * (TILE_SIZE / 2),
    4,
  );

  ctx.strokeRect(
    tileCenter.x - direction * (TILE_SIZE / 2 - 4),
    tileCenter.y + TILE_SIZE / 2 - 4,
    direction * (TILE_SIZE / 2),
    4,
  );

  // since missing robots, spawn preloads
  if (!gameObject) return;
  if (color == "#2F2989") {
    const x = fieldCenter.x - direction * (TILE_SIZE / 2 - 4) + tileCenter.x;
    const y =
      fieldCenter.y +
      direction * (TILE_SIZE / 2 - (direction == 1 ? 8 : 4)) +
      tileCenter.y;

    const offset = 16.8; //2.8x6
    for (let j = 0; j < 2; j++) {
      for (let i = -2; i < 2; i++) {
        let gamePiece = new GamePiece(
          new Transform(
            x + direction * offset + direction * (j * offset),
            y + TILE_SIZE / 2 + direction * (i * offset) - offset / 2,
          ),
          gameObject.physicsWorld,
        );
        gameObject.addChild(gamePiece);
      }
    }
  } else {
    const x = fieldCenter.x - direction * (TILE_SIZE / 2 - 4) + tileCenter.x;
    const y =
      fieldCenter.y +
      direction * (TILE_SIZE / 2 - (direction == 1 ? 8 : 4)) +
      tileCenter.y;

    const offset = 16.8; //2.8x6
    for (let i = -2; i < 2; i++) {
      let gamePiece = new GamePiece(
        new Transform(
          x + direction * offset + direction,
          y - TILE_SIZE / 2 + direction * (i * offset) + offset / 2,
        ),
        gameObject.physicsWorld,
      );
      gameObject.addChild(gamePiece);
    }
  }
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

function drawFlower(
  ctx: CanvasRenderingContext2D,
  tileCenter: Transform,
  direction: 1 | -1,
  fieldCenter: Transform,
  gameObject?: GameObject,
  side?: 1 | -1,
) {
  const flowerWidth = redGP.radius * 2;
  const flowerHeight = redGP.radius * 2;
  const radius = blueGP.radius;
  const flowerX =
    tileCenter.x - TILE_SIZE / 2 - flowerWidth / 2 + (side == 1 ? 130 : 14);
  const flowerY =
    tileCenter.y +
    direction *
      (TILE_SIZE / 2 - (side == null ? (direction == 1 ? 25 : 3) : 0));

  ctx.strokeStyle = "#F8CF6C";

  ctx.strokeRect(flowerX, flowerY, flowerWidth, flowerHeight);

  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  ctx.arc(
    flowerX + flowerWidth / 2,
    flowerY + flowerHeight / 2,
    radius,
    0,
    Math.PI * 2,
    false,
  );
  ctx.stroke();

  if (gameObject) {
    const x = fieldCenter.x + flowerX + flowerWidth / 2;
    const y = fieldCenter.y + flowerY + flowerHeight / 2;

    const pieceCount = 4;
    const pieceRadius = 1.8 * 6;

    const placementRadius = radius - pieceRadius - 2;

    for (let i = 0; i < pieceCount; i++) {
      const angle = (i / pieceCount) * Math.PI * 2;

      const pieceX = x + Math.cos(angle) * placementRadius;
      const pieceY = y + Math.sin(angle) * placementRadius;

      let gamePiece = new GamePiece(
        new Transform(pieceX, pieceY, pieceRadius * i),
        gameObject.physicsWorld,
      );
      gamePiece.airborne = i == 0 ? false : true;
      gameObject.addChild(gamePiece);
      console.log(gamePiece.airborne);
    }

    const body = gameObject.physicsWorld.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(x, y),
    );

    const thickness = 2;
    const segments = 32;
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const nextAngle = ((i + 1) / segments) * Math.PI * 2;
      const midAngle = (angle + nextAngle) / 2;
      const segmentLength = 2 * radius * Math.sin(Math.PI / segments);

      const collider = RAPIER.ColliderDesc.cuboid(
        segmentLength / 2,
        thickness / 2,
      )
        .setTranslation(
          radius * Math.cos(midAngle),
          radius * Math.sin(midAngle),
        )
        .setRotation(midAngle + Math.PI / 2)
        .setCollisionGroups(
          collisionGroups(COLLISION_GROUP.world, WORLD_COLLISION_GROUPS),
        );
      gameObject.physicsWorld.createCollider(collider, body).setFriction(0);
    }
    const centerCollider = RAPIER.ColliderDesc.cuboid(
      flowerWidth / 2,
      flowerHeight / 2,
    )
      .setCollisionGroups(
        collisionGroups(COLLISION_GROUP.world, WORLD_COLLISION_GROUPS),
      );
    gameObject.physicsWorld
      .createCollider(centerCollider, body)
      .setFriction(0);
  }
}

function drawHives(
  ctx: CanvasRenderingContext2D,
  fieldCenter: Transform,
  gameObject?: GameObject,
) {
  const width = 20 * 6;
  const height = 12 * 6;

  // colliders, yayyyyyy kill me
  const addWall = (pos: Transform, width: number, height: number) => {
    if (!gameObject) return;
    gameObject.physicsWorld.createCollider(
      RAPIER.ColliderDesc.cuboid(width / 2, height / 2)
        .setTranslation(pos.x, pos.y)
        .setCollisionGroups(
          collisionGroups(COLLISION_GROUP.world, WORLD_COLLISION_GROUPS),
        ),
      gameObject.body,
    );
  };

  const addPentagonCollider = (pos:Transform, direction: 1 | -1) => {
    if (!gameObject) return

    const peak = height * 0.3;
    const thickness = 4;

    const vertices =
      direction == 1
        ? [
            [0, peak],
            [width / 2, 0],
            [width, peak],
            [width, height],
            [0,height]
        ]
        : [
          [0,0],
          [width, 0],
          [width, height - peak],
          [width / 2, height],
          [0, height - peak]
        ];

    for (let i = 0; i < vertices.length; i++) {
      const a = vertices[i];
      const b = vertices[(i + 1 ) % vertices.length];

      const dx = b[0] - a[0]
      const dy= b[1] - a[1]

      const length = Math.hypot(dx, dy)
      const angle = Math.atan2(dy, dx)

      const midX = (a[0] + b[0]) / 2
      const midY = (a[1] + b[1]) / 2

      const collider = RAPIER.ColliderDesc.cuboid(
          length / 2,
          thickness / 2,
        )
          .setTranslation(
            pos.x + midX,
            pos.y + midY,
          )
          .setRotation(angle)
          .setCollisionGroups(
        collisionGroups(COLLISION_GROUP.hive, COLLISION_GROUP.ball),
      )
      gameObject.physicsWorld.createCollider(collider, gameObject.body);
    }

    const interior = RAPIER.ColliderDesc.cuboid(width / 2, height / 2)
      .setTranslation(pos.x + width / 2, pos.y + height / 2)
      .setSensor(true)
      .setCollisionGroups(
        collisionGroups(COLLISION_GROUP.hive, COLLISION_GROUP.ball),
      );
    const interiorCollider = gameObject.physicsWorld.createCollider(
      interior,
      gameObject.body,
    );
    registerHiveInterior(interiorCollider.handle);
  }

  // for the sake of simplicity im js gonna do four pentagon, red upper red lower, blue upper blue lower
  const drawPentagon = (
    pos: Transform,
    color: string,
    direction: 1 | -1,
    active: boolean,
    preload?: boolean,
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = "#9c9c9c10";
    ctx.lineWidth = 6;
    ctx.setLineDash(active ? [] : [10, 2]);

    pos.x = pos.x - TILE_SIZE / 2 + 12;
    pos.y = pos.y - TILE_SIZE / 2 + height / 2;

    const peak = height * 0.3;

    if (direction === 1) {
      ctx.moveTo(pos.x, pos.y + peak);
      ctx.lineTo(pos.x + width / 2, pos.y);
      ctx.lineTo(pos.x + width, pos.y + peak);
      ctx.lineTo(pos.x + width, pos.y + height);
      ctx.lineTo(pos.x, pos.y + height);
    } else {
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x + width, pos.y);
      ctx.lineTo(pos.x + width, pos.y + height - peak);
      ctx.lineTo(pos.x + width / 2, pos.y + height);
      ctx.lineTo(pos.x, pos.y + height - peak);
    }

    if (active) addPentagonCollider(pos, direction)
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.setLineDash([]);

    if (!gameObject) return;
    if (!preload) return;
    const xOffset = direction * (2 * (1.8 * 6));
    const preloadPos = new Transform(
      fieldCenter.x +
        pos.x +
        (direction == 1 ? redGP.radius * 2 : redGP.radius * 6),
      fieldCenter.y + (direction === 1 ? pos.y + height - peak : pos.y + peak),
    );
    for (let i = 0; i < 3; i++) {
      let gamePiece = new GamePiece(
        new Transform(preloadPos.x + i * xOffset, preloadPos.y),
        gameObject.physicsWorld,
        color == "#E1171E" ? redGP : blueGP,
      );

      gameObject.addChild(gamePiece);
    }
  };

  ctx.fillStyle = "#676767";
  const metal = getCenterTile(2, 2);
  ctx.fillRect(metal.x, metal.y + TILE_SIZE / 2 - 9, width + 20, 18);

  ctx.fillRect(
    metal.x - 9,
    metal.y - TILE_SIZE / 2 + height * 1.5 + 2,
    12,
    TILE_SIZE / 2 - 4,
  );

  ctx.fillRect(
    metal.x + 2 * (TILE_SIZE / 2) - 9,
    metal.y - TILE_SIZE / 2 + height * 1.5 + 2,
    12,
    TILE_SIZE / 2 - 4,
  );

  const posX = TILE_SIZE - 9;
  const posY = (-height * 3) / 2;
  ctx.fillRect(posX, posY, 8, Math.abs(posY * 2));
  ctx.fillRect(-posX - 8, posY, 8, Math.abs(posY * 2));

  drawPentagon(getCenterTile(2, 2), "#E1171E", 1, true, true);
  drawPentagon(getCenterTile(2, 3), "#E1171E", -1, false);

  drawPentagon(getCenterTile(3, 2), "#2F2989", 1, false);
  drawPentagon(getCenterTile(3, 3), "#2F2989", -1, true, true);

  addWall(new Transform(posX + 4, 0), 8, Math.abs(posY * 2));
  addWall(new Transform(-posX - 4, 0), 8, Math.abs(posY * 2));
}
