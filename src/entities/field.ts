import type { World } from "@dimforge/rapier2d-compat";
import { GameObject } from "../engine/GameObject";
import drawField from "../render/drawField";
import RAPIER from "@dimforge/rapier2d-compat";
import {
  COLLISION_GROUP,
  WORLD_COLLISION_GROUPS,
  collisionGroups,
} from "../physics/collisionGroups";

export class Field extends GameObject {
  private FIELD_PIXELS = 144 * 6;
  private fieldHalf = this.FIELD_PIXELS / 2;

  name = "field";

  render(ctx: CanvasRenderingContext2D): void {
    drawField(ctx, this.transform);
  }
  initPhysics(physicsWorld: World): void {
    const RigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
      .setTranslation(this.transform.x, this.transform.y)
      .setCcdEnabled(true);

    this.body = physicsWorld.createRigidBody(RigidBodyDesc);

    const topWall = RAPIER.ColliderDesc.cuboid(this.fieldHalf, 2)
      .setTranslation(0, -this.fieldHalf)
      .setFriction(0)
      .setCollisionGroups(
        collisionGroups(COLLISION_GROUP.world, WORLD_COLLISION_GROUPS),
      );
    const bottomWall = RAPIER.ColliderDesc.cuboid(this.fieldHalf, 2)
      .setTranslation(0, this.fieldHalf)
      .setFriction(0)
      .setCollisionGroups(
        collisionGroups(COLLISION_GROUP.world, WORLD_COLLISION_GROUPS),
      );
    const leftWall = RAPIER.ColliderDesc.cuboid(2, this.fieldHalf)
      .setTranslation(-this.fieldHalf, 0)
      .setFriction(0)
      .setCollisionGroups(
        collisionGroups(COLLISION_GROUP.world, WORLD_COLLISION_GROUPS),
      );
    const rightWall = RAPIER.ColliderDesc.cuboid(2, this.fieldHalf)
      .setTranslation(this.fieldHalf, 0)
      .setFriction(0)
      .setCollisionGroups(
        collisionGroups(COLLISION_GROUP.world, WORLD_COLLISION_GROUPS),
      );

    physicsWorld.createCollider(topWall, this.body).setFriction(0);
    physicsWorld.createCollider(bottomWall, this.body).setFriction(0);
    physicsWorld.createCollider(leftWall, this.body).setFriction(0);
    physicsWorld.createCollider(rightWall, this.body).setFriction(0);
  }
}
