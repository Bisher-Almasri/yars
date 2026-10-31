import { World } from "@dimforge/rapier2d-compat";
import { GameObject } from "../engine/GameObject";
import { drawGamePiece } from "../render/drawGamePiece";
import type { gamePiece, gamePieceType } from "../types";
import RAPIER from "@dimforge/rapier2d-compat";
import type { Transform } from "../engine/Transform";
import {
  BALL_COLLISION_GROUPS,
  COLLISION_GROUP,
  collisionGroups,
  isHiveInterior,
} from "../physics/collisionGroups";

export class GamePiece extends GameObject {
  public gP: gamePiece = {
    radius: 1.4 * 6,
    color: "#FFE400",
  };

  name = "Game Piece";

  public type: gamePieceType = "Pollen";

  private verticalVelocity = 0;
  private readonly gravity = 900;
  public airborne = false;
  public insideHive = false;

  private collider?: RAPIER.Collider;

  constructor(
    transform: Transform,
    physicsWorld: RAPIER.World,
    gP?: gamePiece,
    type?: gamePieceType,
  ) {
    super(transform, physicsWorld);
    if (gP) this.gP = gP;
    if (type) this.type = type;
  }

  launch(verticalVelocity: number) {
    this.transform.z = 1;
    this.verticalVelocity = verticalVelocity;
    this.airborne = true;

    this.collider?.setSensor(true);
    this.body?.setLinearDamping(0.13);
  }

  update(
    dt: number,
    eventQueue: RAPIER.EventQueue,
    physicsWorld: RAPIER.World,
  ): void {
    if (this.transform.z > 0) this.airborne = true;
    super.update(dt, eventQueue, physicsWorld);
    this.insideHive = false;
    physicsWorld.colliders.forEach((collider) => {
      if (
        isHiveInterior(collider.handle) &&
        physicsWorld.intersectionPair(collider, this.collider!)
      ) {
        this.insideHive = true;
      }
    });

    if (!this.airborne) return;

    this.verticalVelocity -= this.gravity * dt;
    this.transform.z += this.verticalVelocity * dt;

    if (this.transform.z <= 0) {
      this.transform.z = 0;
      this.verticalVelocity = 0;
      this.airborne = false;

      this.collider?.setSensor(false);
      this.body?.setLinearDamping(1.5);
    }
  }
  render(ctx: CanvasRenderingContext2D): void {
    drawGamePiece(ctx, this.transform, this.gP);
  }

  initPhysics(physicsWorld: World): void {
    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(this.transform.x, this.transform.y)
      .setLinearDamping(1.5)
      .setCcdEnabled(true);

    this.body = physicsWorld.createRigidBody(rigidBodyDesc);
    this.body.userData = this;

    let collider = RAPIER.ColliderDesc.ball(this.gP.radius)
      .setRestitution(0.4)
      .setCollisionGroups(
        collisionGroups(COLLISION_GROUP.ball, BALL_COLLISION_GROUPS),
      );

    this.collider = physicsWorld.createCollider(collider, this.body);
  }
}
